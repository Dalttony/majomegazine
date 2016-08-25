<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="-1">
<meta http-equiv="pragma" content="no-cache">

<?=link_tag('assets/css/normalize.css');?>
<?=link_tag('assets/css/style.css');?>
<link rel="stylesheet" href="https://code.getmdl.io/1.1.1/material.blue_grey-blue.min.css"/>
<div id="middle">
</div>
<?=script_tag('assets/js/react/react.js');?>
<?=script_tag('assets/js/react/react-dom.js')?>
<?=script_tag('assets/js/react/react-dom-server.js')?>
<?=script_tag('assets/js/jquery-1.12.1.min.js')?>
<?=script_tag('assets/js/jquery.simplemodal.js')?>
<?=script_tag('assets/js/underscore-min.js')?>
<?=script_tag('assets/js/backbone-min.js')?>
<?=script_tag('assets/js/canvg.js')?>
<!--<?=script_tag('assets/js/build/majo.js')?>-->
<?=script_tag('assets/js/majo.js')?>
<?=script_tag('assets/js/build/majoview.js')?>
<?=script_tag('assets/js/build/observer.js')?>
<?=script_tag('assets/js/build/model.js')?>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1013135508743319',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>