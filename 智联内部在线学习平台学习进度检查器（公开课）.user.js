// ==UserScript==
// @name         智联内部在线学习平台学习进度检查器（公开课）
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  一键即可检查视频进度是否完成
// @author       RoRochen
// @match        https://xuexi.zhaopin.com/*
// @supportURL   641876223@qq.com
//@icon https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2349859212,1053714951&fm=26&gp=0.jpg
//@require    https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
//@require    https://cdn.bootcss.com/vue/2.6.10/vue.js
//@require    https://cdn.bootcss.com/element-ui/2.12.0/index.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL none
// ==/UserScript==

(function() {
    if(!GM_getValue('zlgkk')){
        var anhao = prompt("请输入暗号：", "哈利波特");
        var v=verityPass(anhao)
        if(v==1){
            alert("长期解锁成功！");
            GM_setValue('zlgkk',true);
        }
        if(v==2) {
            alert("一次性解锁成功！");
        }
        if(v==0) {
            alert("密码错误！");
            return;
        }
    }

    function verityPass(password){
        try{
            var pl=atob(password).split("-");
            var time=new Date(parseInt(pl[1]))
            var now=new Date();
            if(pl[0]=="cq&cll"){
                if((Math.abs(time-now))<=300000){
                    return 1;
                }
            }
            if(pl[0]=="cll&cq"){
                if((Math.abs(time-now))<=300000){
                    return 2;
                }
            }
            return 0;
        }catch (e) {
            return 0;
        }

    }
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css";
    document.body.appendChild(link);
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(
        ".stage{background: #fff;padding: 5px;    margin-top: 5px;border-radius: 10px;box-shadow: 4px 2px 1px rgba(0,0,0,.15);}.suojin{margin:10px}#app::-webkit-scrollbar {width: 4px;height: 4px;}#app::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);border-radius: 0;background: rgba(0,0,0,0.1);}#app::-webkit-scrollbar-thumb { border-radius: 5px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: rgba(0,0,0,0.2);}.mu-button{  margin: 8px;vertical-align: middle;user-select:none;outline: none;-webkit-appearance: none;background-color: #2196f3;color: #fff;border-radius: 50%;z-index: 1111;border:none;text-align: center;box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);}.mu-button:active{box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12);}.mu-button:hover{box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12);}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);



    var Page_Size=10;
    var ass_Panel_Status=false;
    var assPanel=$('<div id="app" style="position:fixed;right:0;bottom:0;width:600px; padding: 10px;display: none; max-height: 600px;overflow-y: scroll;background: #407ef4;box-shadow: 2px 0 5px 0 rgba(0,21,41,.35);"><div style="display: flex;justify-content: space-between;color:#fff"><div>第<el-input-number size="mini" v-model="page"></el-input-number>页</div><el-select v-model="gradeId" placeholder="请选择"><el-option v-for="item in gradeList" :key="item.lessonId" :label="item.lessonName" :value="item.lessonId"> </el-option> </el-select><div >智联辅助V2</div></div>'
        +'<div v-for=" stage in list" class="stage" >'
        +'<div>'
        +'<div style="display:flex;justify-content: space-between;" ><div>阶段:{{stage["stageName"]}}</div><el-progress  :percentage="parseInt(stage.stageRate)" style="width:150px;" ></el-progress></div>'
        +'<div v-for="chapter in stage.chapterList" class="suojin  el-card box-card is-always-shadow" style="padding:10px;">章节：'
        +'<div>{{chapter["chapterName"]}}</div>'
        +'<div class="suojin" v-for="video in chapter.videoList">'
        +'<div style="display: flex;justify-content: space-between;"><div><i class="el-icon-video-camera-solid" style="font-size: 20px;"></i>{{video["title"]}}</div><el-button size="mini" round v-on:click="viewVideo(video.itemId,video.length,video.title)" type="primary">检查</el-button></div>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div></div>');
    var assbtn=$('<button type="button" class="mu-button" style="position:fixed;right:0;bottom:0;width: 40px;height: 40px;">辅助</button>')
    $('body').append(assbtn)
    $('body').append(assPanel)
    var vueobj=new Vue({el:'#app',data(){
            return {page:1,gradeList:[],gradeId:-1,list:[{stageId:'',stageName:'',stageRate:'',chapterList:[{chapterId:'',chapterName:'',videoList:[{itemId:'',title:'',length:''}]}]}]}
        },
        methods: {
            viewVideo(itemId,length,title){
                var requestParam={itemId: itemId, time: length, watchTime: length};
                $.ajax({
                    url:"https://rest-xuexi.zhaopin.com/lesson/record/watch/time",
                    type:"POST",
                    data:JSON.stringify(requestParam),
                    headers:{'Authorization':getCookie("oxtoken")},
                    dataType:"json",
                    async:false,
                    contentType:"application/json",
                    success:function(result){
                        var temp=vueobj.page;
                        vueobj.page=0;
                        vueobj.page=temp;
                        vueobj.$notify({
                            title: '成功',
                            message: title+"   执行检查操作，"+result.msg,
                            type: 'success'
                        });
                    }

                });
            },

        },
        watch:{
            page:function(){
                getVideoList(vueobj.gradeId,vueobj.page,Page_Size)
            }
        }
    })
    assbtn.click(function(){
        if(ass_Panel_Status){
            $('#app').css('display','none')
        }else{
            $('#app').css('display','block')
        }
        ass_Panel_Status=!ass_Panel_Status;
    });

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    $.ajax({
        url:"https://rest-xuexi.zhaopin.com/common/lesson/box",
        type:"GET",
        headers:{'Authorization':getCookie("oxtoken")},
        dataType:"json",
        async:false,
        contentType:"application/json",
        success:function(result){
            console.log("智联脚本",result)
            vueobj.gradeList=result.data;
            vueobj.gradeId=result.data[0].lessonId;

        }
    });

    function getVideoList(gradeId,page,size){
        var data={p:page,s:size,lessonId:gradeId,stageName:""}
        $.ajax({
            url:"https://rest-xuexi.zhaopin.com/lesson/stage/list",
            type:"POST",
            headers:{'Authorization':getCookie("oxtoken")},
            dataType:"json",
            async:false,
            data:JSON.stringify(data),
            contentType:"application/json",
            success:function(result){
                console.log("智联脚本",result)
                vueobj.list=dealStageList(result)
            }

        });
    }
    getVideoList(vueobj.gradeId,vueobj.page,Page_Size)
    function dealStageList(data){
        var result=[];
        data.data.page.list.forEach(function(item){
            var i={stageId:item.stageId,stageName:item.stageName,stageRate:item.studyProgress,chapterList:[]};
            item.chapters.forEach(function(item2){
                var chapterItem={chapterId:item2.chapterId,chapterName:item2.chapterName,videoList:[]}
                var reqData={gradeId: vueobj.gradeId, stageId: item.stageId, chapterId: item2.chapterId}  ;
                var url="https://rest-xuexi.zhaopin.com/lesson/"+reqData.gradeId+"/"+reqData.stageId+"/chapter/detail/"+reqData.chapterId
                $.ajax({
                    url:url,
                    type:"GET",
                    headers:{'Authorization':getCookie("oxtoken")},
                    dataType:"json",
                    async:false,
                    contentType:"application/json",
                    success:function(result){
                        result.data.items.forEach(function(item3){
                            var videoItem={itemId:item3.itemId,title:item3.itemName,length:item3.length}
                            chapterItem.videoList.push(videoItem)
                        })
                    }

                });
                i.chapterList.push(chapterItem)
            });
            result.push(i)
        })
        return result;
    }



})();