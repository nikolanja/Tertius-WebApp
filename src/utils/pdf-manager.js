import * as jsPDF from 'jspdf';
import Post from '../components/pages/posts/post';

const createPostPdf = (post, filename) => {
    var pdf = new jsPDF('p', 'pt', [612, 792]);
    var post_date;
    if (post.Date === undefined)  
      post_date = 'N/A';
    else 
      post_date = post.Date.substr(0, post.Date.indexOf(' at'));
    
    if (post.Publication === undefined)  post.Publication = 'N/A';
    post.Publication = post.Publication.replace(/’/g, '\'');

    if ((Post.Author === undefined) && (post.CoAuthor === undefined))  post.Author = 'N/A';

    if (post.PageNumber === undefined)  post.PageNumber = 'N/A';
    post.PageNumber = post.PageNumber.replace(/’/g, '\'');

    if (post.Title === undefined)  post.Title = 'N/A';
    post.Title = post.Title.replace(/’/g, '\'');

    if (post.Content === undefined)  post.Content = 'N/A';
    post.Content = post.Content.replace(/’/g, '\'');

    if (post.Comment === undefined)  post.Comment = 'N/A';
    post.Comment = post.Comment.replace(/’/g, '\'');

    var html_content = "<div class='pdf-content'>" + 
        "<style>h3.pdfelement { font-family: 'Helvetica', Arial, sans-serif; font-weight: bold; font-size: 14.66px; font-weight: bold; margin: 0 0 16.25px 0; } p.pdfelement { font-family: 'Times New Roman', Times, serif; font-size: 14.66px; font-weight: normal; margin: 0 0 17.08px 0; }</style>" + 
        "<h3 class='pdfelement'>Date</h3><p class='pdfelement'>" + post_date + "</p>" + 
        "<h3 class='pdfelement'>Publication</h3><p class='pdfelement'>" + post.Publication + "</p>" + 
        "<h3 class='pdfelement'>Author(s)</h3><p class='pdfelement'>" + post.Author + ((post.CoAuthor !== undefined && post.CoAuthor !== '') ? ('<br />' + post.CoAuthor) : '') + "</p>" + 
        "<h3 class='pdfelement'>Page(s)</h3><p class='pdfelement'>" + post.PageNumber + "</p>" + 
        "<style>p.pdfelement1 { font-family: 'Times New Roman', Times, serif; font-size: 14.66px; font-weight: normal; margin: 0 0 22.42px 0; }</style>" + 
        "<h3 class='pdfelement'>Post Title</h3><p class='pdfelement1'>" + post.Title + "</p>" + 
        "<style>h3.pdfelement2 { white-space: pre-wrap; font-family: 'Helvetica', Arial, sans-serif; font-weight: bold; font-size: 14.66px; font-weight: bold; margin: 0 0 13.58px 0; } p.pdfelement2 { font-family: 'Times New Roman', Times, serif; font-size: 14.66px; font-weight: normal; margin: 0 0 28.1px 0; line-height: 1.45}</style>" + 
        "<h3 class='pdfelement2'>Excerpt/Entry</h3><p class='pdfelement2' id='post_content'></p>" + 
        "<style>h3.pdfelement3 { font-family: 'Helvetica', Arial, sans-serif; font-weight: bold; font-size: 14.66px; font-weight: bold; margin: 0 0 12.52px 0; } p.pdfelement3 { font-family: 'Times New Roman', Times, serif; font-size: 14.66px; font-weight: normal; margin: 0 0 0 0; line-height: 1.46}</style>" + 
        "<h3 class='pdfelement3'>Comments</h3><p class='pdfelement3'>" + post.Comment + "</p></div>";
    var sec = document.createElement('div');
    const pdf_element_id = 'b1a5f625166c487c93e0c9ecf84f0b58';
    sec.id = pdf_element_id;
    sec.innerHTML = html_content;

    document.body.appendChild(sec);
    document.getElementById('post_content').innerHTML = post.Content;
    document.getElementById('post_content').innerHTML = document.getElementById('post_content').textContent;
    
    var margins = {
        top: 70,
        bottom: 40,
        left: 72,
        right: 72
    };

    pdf.fromHTML(document.getElementById(pdf_element_id).firstChild, 
		margins.left, // x coord
		margins.top,
		{
		  width: 436// max width of content on PDF
		},function(dispose) {}, margins);
    
    document.getElementById(pdf_element_id).remove();
    return pdf;
}

export default  createPostPdf;