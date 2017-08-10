;(function(){
    /*
     store.set('user', { name:'Marcus' });
     store.set("gg",12312);
     store.clearAll()*/

    /*var arr=[1,23,4,5];
     store.set("gg", arr);
     store.clearAll()*/

    var task_list=[];  //任务列表
    var $add_task=$(".add-task");  //提交
    init();  //初始化


    $add_task.on("submit",function(ev){
        ev.preventDefault(); //阻止默认事件
        //console.log(1)
        var obj={};
        obj.content=$add_task.find("input").eq(0).val();

        if (!obj.content) return;
        //console.log(obj)

        add_task(obj);
        createHtml(); //生成thml
        $add_task.find("input").eq(0).val(null);  //清空
    });

//
    function  init() {
        task_list=store.get("gg") || [];
        clock_time(); //闹种
        createHtml(); //生成thml
    }

//把对像push数组里面
    function add_task(obj) {
        task_list.push(obj);
        //console.log(task_list)
        //把数据存到浏览器
        store.set("gg",task_list);
    }


//1.创建一个对像  push数组里面
//2.把数据存到浏览器
//3.把数据取出来

//生成hmtl
    function createHtml() {
        var $task_list=$(".task-list");
        $task_list.html(null); //清空
        var complate_items=[];
        for(var i=0; i<task_list.length; i++){
            if (task_list[i].complated){ //选中了
                complate_items[i]=task_list[i]
            }
            else{
                var $item=bindHtml(task_list[i],i);
                $task_list.append($item);
                clock_time($item); //闹种提醒
            }

        }
        for(var j=0; j<complate_items.length; j++){
            if(complate_items[j]){
                $item=bindHtml(complate_items[j],j);
                $item.addClass("complated");  //添加clss
                $task_list.append($item);

            }


        };
        bindDelete();  //删除任务列表
        task_list_detail();  //详细
        add_complated(); //生成complated

    }

//绑定html
    function bindHtml(data,index){
        var str='<li  data-index="'+index+'">'+
            '<hr>'+
            '<input type="checkbox" '+(data.complated ? "checked" : "")+'   class="complate">'+
            '<p class="content">'+data.content+'</p>'+
            '<div class="right">'+
            '<span class="delete r-main">删除</span>'+
            '<span class="detail r-main">详细</span>'+
            '</div>'+
            '</li>';
        return $(str);
    }

    /*------------------------------删除-------------------------------------*/
//点击事件
    function bindDelete(){
        $(".delete.r-main").click(function(){
            //获取index
            var index = $(this).parent().parent().data("index");

            remove_task_list(index);
        });
    };
//删除功能
    function remove_task_list(index){
        var off=false;
        $(".Alert").show();
        $(".primary.confirm").bind("click",function(){
            off=true;
            $(".Alert").hide();

            //var off = confirm("你确定要删除么");

            if(!off) return;
            task_list.splice(index,1);
            refresh_task_list(); //更新
            $(".primary.confirm").unbind("click");
        })
        $(".cancel").click(function(){
            off=false;
            $(".Alert").hide();
        })

    }
//更新 本地存储
    function refresh_task_list(){
        store.set("gg",task_list);
        createHtml(); //更新列表
    }
    /*------------------------------删除 end-------------------------------------*/


    /*------------------------------生成详细 start-------------------------------------*/
    //1.点击 后  获取 index
    function task_list_detail() {
        $(".detail.r-main").click(function () {
            var index = $(this).parent().parent().data("index");
            add_detail_html(task_list[index],index);
        });
    };
    //2.生成弹框
    function add_detail_html(data,index){
        var str='<div class="task-detail-mask"></div>'+
            '<div class="task-detail">'+
            '<form class="up-task">'+
            '<h2 class="content">'+(data.content || "")+'</h2>'+
            '<div class="input-item">'+
            '<input type="text" class="db-content">'+
            '</div>'+
            '<div class="input-item">'+
            '<textarea class="taile">'+(data.tatil || "")+'</textarea>'+
            '</div>'+
            '<div class="remind input-item">'+
            '<label for="b">提醒时间</label>'+
            '<input id="b" class="datetime" type="text" value="'+(data.datetime || "")+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button class="ut-data">更新</button>'+
            '</div>'+
            '<div class="colse">X</div>'+
            '</form>'+
            '</div>';

        $(".container .task-list").after(str);

        $.datetimepicker.setLocale('ch');
        $('.datetime').datetimepicker();

        remove_detail(); //删除弹框

        up_task(index); //提交详细任务
        dbclick_detail(); //双击
    }
    //3.删除弹框  removechild()
    function remove_detail(){
        $(".task-detail-mask,.colse").click(function () {
            $(".task-detail-mask,.task-detail").remove();
        })
    }
    /*------------------------------详细 end-------------------------------------*/


    /*详细提交*/


    //1.点击更新  获取index
    //2.新建一个对像  newobj={};
    //newobj.content=标题
    //newobj.dateil=input.val();
    //newobj.time=input.val();

    //task_list[index] = newobj

    //不行
    //$.extend();

    function up_task(index){
        $(".up-task").on("submit",function (ev) {
            ev.preventDefault();
            //新建一个对像  newobj={};
            var newobj={};
            newobj.content=$(this).find(".content").text();
            newobj.tatil=$(this).find(".taile").val();
            newobj.datetime=$(this).find(".datetime").val();

            up_data(newobj,index);//更新详细数据
            $(".task-detail-mask,.task-detail").remove(); //删除详细框
            createHtml(); //更新html
        })
    }
    //双击事件
    function dbclick_detail(){
        $(".up-task .content").dblclick(function () {
            var $that=$(this); //文字
            var $inputVal=$(".container .up-task .db-content"); //输入框
            $that.hide();
            $inputVal.show();

            $inputVal.focus();
            $inputVal.on("blur",function(){
                $that.show();
                $inputVal.hide();
                if (!$inputVal.val()) return;
                $that.text($inputVal.val());

            })
        })
    }

    //更新详细数据
    function up_data(newobj,index){
        //task_list[index] = newobj;
        task_list[index] = $.extend({},task_list[index],newobj);
        store.set("gg",task_list);
        //add_detail_html(task_list[index],index);
    }


    //添加complated
    function add_complated(){
        var complate =$(".task-list .complate");
        complate.click(function () {

            var index = $(this).parent().data("index");
            if(task_list[index].complated){
                up_data({complated:false},index);
                /*$(".container .task-list").find("li").eq(index).removeClass();      //勾上加背景色
                $(".container .task-list").find("li").eq(index).find("hr").hide();*/
            }
            else{
                up_data({complated:true},index);
                /*$(".container .task-list").find("li").eq(index).addClass("dali");   //勾上去背景色
                $(".container .task-list").find("li").eq(index).find("hr").show();*/

            }
            createHtml();//更新complated
        });
    }

    //闹钟提醒
    //1.获取 start_time=  当前的时间
    //2.过滤
    //3.end_time= 结束时间   task_list[i].datetime
    //得到毫秒
    //到时间了， 播放音乐 提醒    显示黄色条
    //关闭音乐
    var timer=null;
    //clock_time();


    function clock_time(obj){
        if (!$(obj)[0]) return;

        clearInterval($(obj)[0].timer);
        $(obj)[0].timer=setInterval(function(){
            //1.获取 start_time=  当前的时间
            var start_time=new Date().getTime();
            var $item=task_list;
            for(var i=0; i<$item.length; i++){
                //2.过滤
                if ($item[i].complated || !$item[i].datetime || $item.off) continue;

                //3.end_time= 结束时间   task_list[i].datetime
                var end_time=(new Date($item[i].datetime)).getTime();

                if (end_time - start_time <=1){

                    clearInterval($(obj)[0].timer);


                    //播放音乐
                    play_music();
                    //弹出提醒框
                    show_alert(task_list[i],i);

                }
            }
        },1000);
    }

    function show_alert(item,i) {
        $(".msg").show();
        $(".msg-content").text(item.content);
        $(".msg-btn").click(function(){
            up_data({off:true},i);  //添加属性
            $(".msg").hide();
        })
    }

    //播放音乐
    function play_music() {
        var music01=document.getElementById("music");
        music01.play();
    }
}());

