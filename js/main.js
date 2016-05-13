/*干掉默认事件*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    /*自适应处理*/
    function resize(){
    var size=function(){return $(window).width()/750;};
    $("html").css({
        "-webkit-transform":"scale("+size()+")",
        "transform":"scale("+size()+")",
        "height":(($(window).height()/$(window).width())*750)+"px"
        });
    }
    /*先执行一次*/
    resize();
    /*屏幕有变动的时候再执行*/
    $(window).on("resize",resize);
    /*滚屏*/
    $(".wrap").each(function(){
        new IScroll('#'+$(this).attr("id"), {  });
    });