const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// Remember to set token using >> firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
const stripe = require('stripe')('sk_live_OFR3xN3NdBrcxUM33hz26hJ3');
const cors = require('cors')({
    origin: true,
});

// test ids for stripe
// const monthly_plan = 'plan_EfuLPQ06tqmSCL';
// const yearly_plan = 'plan_EfuNm6aIVSlB7l';

// live ids for stripe
const monthly_plan = 'plan_ewgwegweg';
const yearly_plan = 'plan_wegwegwegweg';

const MAILGUN_ADMIN_EMAIL = 'admin@tertius.app';
const MAILGUN_API_KEY = 'eca76sadfwegwegaed4-985b58f4-621997ed';
const MAILGUN_DOMAIN = 'tertius.app';
var mailgun = require('mailgun-js')({apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN});

exports.createUser = functions.auth.user().onCreate( async (user) => {
	const email = user.email;
  
	const customer = await stripe.customers.create({
		email: email
	});
    
    let nowTimestamp = Date.now();

    const data = {
        from: 'Tertius User <me@tertius.mailgun.org>',
        to: MAILGUN_ADMIN_EMAIL,
        subject: 'New User Account',
        text: 'The following user has created a new account: [' + email + ']'
    };

    mailgun.messages().send(data, (error, body) => {});

	return admin.database().ref("/User/" + user.uid).set({
		userID: user.uid,
		email: email,
		stripeCustomerID: customer.id,
        PaidType: 'free',
        Status: 'normal',
        CreatedAt: nowTimestamp,
        ExpiredAt: nowTimestamp + 1000 * 3600 * 24 * 31, 
    })
});

exports.deleteUser = functions.database.ref('User/{userId}').onDelete(async (snapshot) => {
    const user = snapshot.val();
    admin.auth().deleteUser(user.userID)

    const data = {
        from: 'Tertius User <me@tertius.mailgun.org>',
        to: MAILGUN_ADMIN_EMAIL,
        subject: 'Account Deletion',
        text: 'The following user has deleted their account: [' + user.email + ']'
    };

    mailgun.messages().send(data, (error, body) => {
    });
    return await stripe.customers.del(user.stripeCustomerID)
})

exports.changeUser = functions.database.ref('User/{userId}/Status').onUpdate( async (snapshot, context) => {
    if(snapshot.before.val() !== 'deactivate' && snapshot.after.val() === 'deactivate'){
        let uid = context.params.userId;
        return admin.database().ref("User/" + uid).once("value", async (snap) => {
            user = snap.val();
            return stripe.customers.retrieve(
                user.stripeCustomerID,
                (err, customer) => {
                    if(err){
                        console.log(err);
                        return ;
                    }

                    customer.subscriptions.data.forEach((subscription) => {
                        stripe.subscriptions.del(subscription.id, (err, conf)=>{
                            if(err){
                                console.log(err);
                                return ;
                            }
                        });
                    })

                    const data = {
                        from: 'Tertius User <me@tertius.mailgun.org>',
                        to: MAILGUN_ADMIN_EMAIL,
                        subject: 'Account Deactivation',
                        text: 'The following user has deactivated their account: [' + user.email + ']'
                    };
                
                    mailgun.messages().send(data, (error, body) => {});
                    admin.database().ref("/User/" + uid).update({
                        Status: 'deactivate'
                    });
                    return ;
                }
            );
        })
    }
})

exports.deactiveUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        let uid = req.body.user_id;
        return admin.database().ref("User/" + uid).once("value", async (snap) => {
            user = snap.val();
            return stripe.customers.retrieve(
                user.stripeCustomerID,
                (err, customer) => {
                    if(err){
                        console.log(err);
                        res.status(400).send(err)
                        return ;
                    }

                    customer.subscriptions.data.forEach((subscription) => {
                        stripe.subscriptions.del(subscription.id, (err, conf)=>{
                            if(err){
                                console.log(err);
                                res.status(400).send(err)
                                return ;
                            }
                        });
                    })

                    const data = {
                        from: 'Tertius User <me@tertius.mailgun.org>',
                        to: MAILGUN_ADMIN_EMAIL,
                        subject: 'Account Deactivation',
                        text: 'The following user has deactivated their account: [' + user.email + ']'
                    };
                
                    mailgun.messages().send(data, (error, body) => {});
                    admin.database().ref("/User/" + uid).update({
                        Status: 'deactive'
                    });
                    res.status(200).send({success: true})
                    return ;
                }
            );
        })
    })
})

exports.createSubscribe = functions.https.onRequest(async (req, res) => {

    cors(req, res, () => {
        let card_no = req.body.card_no;
        let card_expiry_month = req.body.card_expiry_month;
        let card_expiry_year = req.body.card_expiry_year;
        let card_cvc = req.body.card_cvc;
        let user_id = req.body.user_id;
        let subscribe_type = req.body.subscribe_type;
    
        //res.status(400).send(req.body);
        if(user_id === undefined || user_id === null){
            res.status(400).send({error: 'There is no selection user.'});
            return ;
        }
    
        if(card_no === undefined || card_no === null){
            res.status(400).send({error: 'There is no Card Number.'});
            return ;
        }
    
        if(card_expiry_month === undefined || card_expiry_month === null){
            res.status(400).send({error: 'There is no Expiry.'});
            return ;
        }
    
        if(card_expiry_year === undefined || card_expiry_year === null){
            res.status(400).send({error: 'There is no Expiry.'});
            return ;
        }
    
        if(card_cvc === undefined || card_cvc === null){
            res.status(400).send({error: 'There is no CVC.'});
            return ;
        }
    
        if(subscribe_type === undefined || subscribe_type === null){
            res.status(400).send({error: 'There is no subscribe plan.'});
            return ;
        }
    
        if(subscribe_type !== 'monthly' && subscribe_type !== 'yearly'){
            res.status(400).send('Invalid plan.');
            return ;
        }
        
        var token;
        var user;
        var customer;
        
        admin.database().ref("User/" + user_id).once("value", async (snap) => {
            if(snap === null || snap.val() === null){
                res.status(400).send({error: 'There is no user.'});
                return ;
            }
    
            user = snap.val();
            try{
                token = await stripe.tokens.create({
                    card: {
                        number: card_no,
                        exp_month: card_expiry_month,
                        exp_year: card_expiry_year,
                        cvc: card_cvc
                    }
                });
            } catch (error){
                res.status(503).send({Error: error});
                return ;
            }
    
            try {
                customer = await stripe.customers.update(user.stripeCustomerID, {source: token.id});
            } catch(error){
                res.status(503).send({Error: error});
                return ;
            }
    
            try {
                admin.database().ref("/User/" + user_id).update({
                    PaidType: subscribe_type,
                    Status: 'normal'
                })

                const subscription = stripe.subscriptions.create({
                    customer: user.stripeCustomerID,
                    items: [{plan: subscribe_type === 'monthly' ? monthly_plan : yearly_plan}],
                });
    
                res.status(200).send({status: 'success'});
            } catch (error){
                res.status(503).send({Error: error});
            }
        })
    })
})

exports.receiveChargeState = functions.https.onRequest(async (req, res) => {
    let type = req.body.type
    let customer_id = req.body.data.object.customer

    if(type === 'invoice.payment_succeeded'){
        admin.database().ref().child("User").orderByChild('stripeCustomerID').equalTo(customer_id).once("value", (snap) => {
            var user = undefined;
            snap.forEach(data =>{
                user = data.val();
            })
            
            var per = 0
            if(user.PaidType === 'monthly') 
                per = 100 * 3600 * 24 * 31
            else if(user.PaidType === 'yearly') 
                per = 100 * 3600 * 24 * 365

            admin.database().ref("/User/" + user.userID).update({
                ExpiredAt:  Date.now() + per
            })
            res.status(200).send({success: true})
        })
    }else {
        res.status(503).send({success: true});
    }
})