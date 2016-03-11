// http://codepen.io/barney-parker/pen/idjCG
// https://www.barneyparker.com/world-simplest-html5-wysisyg-inline-editor/
/*
Big Thanks To:
https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands
*/


/*
<div>
  <div>
    <div id='editControls'>
      <h1>World Simplest HTML5 WYSISYG Inline Editor</h1>
      <div>
        <a data-role='undo' href='javascript:void(0)'><i class='fa fa-undo'></i></a>
        <a data-role='redo' href='javascript:void(0)'><i class='fa fa-repeat'></i></a>
        <a data-role='bold' href='javascript:void(0)'><i class='fa fa-bold'></i></a>
        <a data-role='italic' href='javascript:void(0)'><i class='fa fa-italic'></i></a>
        <a data-role='underline' href='javascript:void(0)'><i class='fa fa-underline'></i></a>
        <a data-role='strikeThrough' href='javascript:void(0)'><i class='fa fa-strikethrough'></i></a>
        <a data-role='justifyLeft' href='javascript:void(0)'><i class='fa fa-align-left'></i></a>
        <a data-role='justifyCenter' href='javascript:void(0)'><i class='fa fa-align-center'></i></a>
        <a data-role='justifyRight' href='javascript:void(0)'><i class='fa fa-align-right'></i></a>
        <a data-role='justifyFull' href='javascript:void(0)'><i class='fa fa-align-justify'></i></a>
        <a data-role='indent' href='javascript:void(0)'><i class='fa fa-indent'></i></a>
        <a data-role='outdent' href='javascript:void(0)'><i class='fa fa-outdent'></i></a>
        <a data-role='insertUnorderedList' href='javascript:void(0)'><i class='fa fa-list-ul'></i></a>
        <a data-role='insertOrderedList' href='javascript:void(0)'><i class='fa fa-list-ol'></i></a>
        <a data-role='h1' href='javascript:void(0)'>h<sup>1</sup></a>
        <a data-role='h2' href='javascript:void(0)'>h<sup>2</sup></a>
        <a data-role='p' href='javascript:void(0)'>p</a>
        <a data-role='subscript' href='javascript:void(0)'><i class='fa fa-subscript'></i></a>
        <a data-role='superscript' href='javascript:void(0)'><i class='fa fa-superscript'></i></a>
      </div>
    </div>
    <div id='editor' contenteditable>
      <h1>This is a title!</h1>
      <p>This is just some example text to start us off</p>
    </div>
    <textarea id='output'></textarea>
  </div>
</div>





#editControls {
  text-align:center;
  padding:5px;
  margin:5px;
}

#editor {
resize:vertical;
overflow:auto;
border:1px solid silver;
border-radius:5px;
min-height:100px;
box-shadow: inset 0 0 10px silver;
padding:1em;
}

#output {
  width:99.7%;
  height:100px
}

a:link {text-decoration:none;}
a:visited {text-decoration:none;}
a:hover {text-decoration:none;}
a:active {text-decoration:none;}
a{
  color:black;
  padding:5px;
  border:1px solid silver;
  border-radius:5px;
  width:1em;
}


 */


$('#editControls a').click(function(e) {
	switch ($(this).data('role')) {
		case 'h1':
		case 'h2':
		case 'p':
			document.execCommand('formatBlock', false, $(this).data('role'));
			break;
		default:
			document.execCommand($(this).data('role'), false, null);
			break;
	}
	update_output();
})

$('#editor').bind('blur keyup paste copy cut mouseup', function(e) {
	update_output();
})

function update_output() {
	$('#output').val($('#editor').html());
}
