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
    /*登录注册切换*/
    function L2R(page){
        $(".nav_module .line").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate("+page*100+"%, 0px) translateZ(0px)"
        });
        $("#login_page #pageRoll").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate(-"+page*750+"px, 0px) translateZ(0px)"
        });
    }
    /*点击登录(导航)*/
$("#login_page .nav_module #loginNav").unbind("tap").bind("tap",function(){
    L2R(0);
})
$("#login_page .nav_module #registNav").unbind("tap").bind("tap",function(){
    L2R(1);
})