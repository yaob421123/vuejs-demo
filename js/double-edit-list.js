new Vue({
    el: '#edit_main',
    data: {
        message: 'Hello Vue.js!',
        isActive:false,
        match_id:$('#match_id').val(),
        userlist:[], //未配对人员
        grouparr:['A','B','C','D'],//分组
        pairlist:[],//已配对人员
        nowmodel:'',
        newName:'', //新增用户
        newTel:'' //新增电话
    },
    ready:function(){
        this.match_people();
    },
    methods:{
        match_people : function (){
            var _this = this;
            var match_id = this.match_id;
            //this.$http.post(url,postdata,function callback）;

            $.ajax({
                url: 'js/post.js',
                type: 'post',
                data:{
                    match_id:match_id //这个是根据这个ID生成的数据
                },
                dataType: 'json',
                success:function(msg){
                    if(msg.code == 0){
                        var _data = msg.data;
                        _this.$set('userlist', _data.user_list); 
                        _this.$set('pairlist', _data.pair_list);
                    }else{
                        alert(msg.message);
                    }
                }
            })
        },         
        edit_click : function($index){
            if($('.edit-list-ul-click .active').length < 2)return;
            var _this = this;
            var match_id = this.match_id;
            var _index = $index + 1;
            var _nowIdArr = [];
            for(var i = 0; i < $('.edit-list-ul-click .active').length; i++){
                _nowIdArr.push($('.edit-list-ul-click .active').eq(i).attr('id'));
            }

            $.ajax({
                type:'post',
                data:{
                    user_ids:_nowIdArr,
                    match_id:match_id,
                    match_group:_index,
                },
                url:'/wechat/double/pair',
                dataType:'json',
                success:function(msg){
                    if(msg.code == 0){
                        _this.match_people();

                    }else{
                        alert(msg.message);
                    }
                }
            })
        },
        // 已配对人员点击取消配对
        cancel_click : function(item,key,$index,event){
            //key 当前属于那个组
            //$index 当前属于该组第几位
            var _this = this;
            var match_id = this.match_id;
            var group_code = $index + 1;
            var match_group = key;

            var el = event.currentTarget;

            $.ajax({
                type : 'post',
                url : 'cancelPair',
                data : {
                    "match_id" : match_id,
                    "group_code" : group_code,
                    'match_group': match_group
                },
                success: function (data) {
                    if(data.code == 0) {
                        //_this.userlist.push(data.user);
                        _this.match_people();
                        //$(el).remove();
                    }else {
                        alert(data.message);
                    }
                }
            });
        },
        pop_information : function(){
            var _this = this;
            var name = this.newName.trim();
            var phone = this.newTel.trim();
            var match_id = this.match_id;
            var sex = $("input[name='sex']:checked").val();
            console.log(name, phone)
            if(!name){
                $(".pop-edit-p").html("*请输入姓名");
                return false;
            }
            if(!phone){
                $(".pop-edit-p").html("*请输入手机号码");
                return false;
            }else if(isPhoneNo(phone) ==  false){
                $(".pop-edit-p").html("*您输入的手机号码不正确");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "/wechat/double/addUser",
                data:{
                    "name":name,
                    "phone":phone,
                    "sex":sex,
                    "match_id":match_id
                },
                dataType:"json",
                success:function(result){
                    if(result['status']==0){
                        alert(result['message']);
                        _this.match_people();
                        $(".pop-edit-list").hide();
                        $(".pop-edit-list").hide();
                        _this.newName = '';
                        _this.newTel = '';
                    }else{
                        alert(result['message']);
                    }
                }
            }); 
        }
    }
})
$(function(){
    $('.edit-list-ul-click').on('click', 'li', function(){
        if($(this).attr("class") == "active"){
            $(this).removeClass('active');
        }else if($(".edit-list-ul-click").find('.active').length >= 2){
            return;
        }else{
            $(this).addClass('active');
        }
    });

    $(".edit-list-btn1").on('click', function() {
        $(".pop-edit-list").show();
    });


    $(".pop-edit-btn2").on('click',  function() {
        $(".pop-edit-list").hide();
    });
    $(".pop-bg").on('click',  function() {
        $(".pop-edit-list").hide();
    });
})
