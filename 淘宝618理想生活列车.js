var i = 0 ;
var keyword_view=['去浏览','去逛逛'] //浏览任务包含关键词，中间用逗号隔开，几个是或者的关系，满足任意一个即可
var keyword_only_click=['收下祝福','确认','刷新重试','弹窗关闭按钮','点击签到领喵币']//只需要点击的任务
var keyword_one=['点击唤起淘宝','gif;base64','去兑换']//只需要完成一次的任务,且按键一直在那
var n_one=0//几号任务开始
var keyword_back=['任务完成','任务已完成','返回领取'] //浏览界面返回的关键词，两者是或者的关系
var n_time=5 //在浏览界面循环滑动次数上限（再多就返回了），一次大概5到7秒
var search_time=2000 //寻找按键的最长时间 ms
var app=[['com.taobao.taobao','淘宝'],['com.tmall.wireless','天猫'],['com.eg.android.AlipayGphone','支付宝']]
//'com.taobao.taobao','淘宝'
//'com.tmall.wireless','天猫'
//'com.eg.android.AlipayGphone','支付宝'
var n_app=0 //从几号任务开始,从零开始计数
var n_time=2//重复打开应用次数
var n_app_end=app.length*n_time-1//到几号停止，,从零开始计数
var btn
//主函数开始
main() 
function main(){
    //主函数
    auto.waitFor()
    console.show()

    while(true) {
        rsleep(1) 
        
   
        if(btn=find_btn_eq(keyword_only_click)){
            //中间突然跳出的界面,只需点击的那种，或者只需点击就行的按键
            if(btn.clickable()){
                rsleep(1)
                btn.click()
            }else{
                rsleep(1)
                click(btn.bounds().centerX(),btn.bounds().centerY())
            }

        } else if(find_btn(keyword_view)!= null) {
            //浏览任务
            view_main(keyword_view,keyword_back)
        }else if(n_one<keyword_one.length && (btn=find_btn([keyword_one[n_one]]))){
            //只需完成一次的任务
            n_one++
            btn.click()
            view(2)
        }else if(n_app<n_app_end){
            //如果不是所有的app都结束了，继续下一个
            enter_task(app[n_app%3][0],app[n_app%3][1])
            n_app++
        }else {
            //找不到满足条件的按键，返回
            toastLog("\n脚本运行完毕\n模拟浏览任务全部完成（大概）")
            sleep(5000)
            rexit()
        }
    }
}
function enter_task(packagename,appname){
    //进入618活动的任务界面,并领取自动产生的喵币
    var btn,btn2,i=0
    if(currentPackage() != packagename){
        //没有打开应用的话，打开应用
        open_app(packagename,appname)
        toastLog('-----第'+(parseInt(n_app/3)+1)+'次打开应用-----')
        sleep(5000)
    }
    
    
    btn=enter_acticity()
    i=0
    while(!text("关闭").exists()){
        //进入活动界面
        if(i%2==0){
            sleep(2000)
            if(btn2=text('打开图鉴').findOne(search_time)){
                //领取自动产生的喵币
                click(device.width*0.5,btn2.bounds().centerY())
                toastLog('已领取自动产生的喵币')
                rsleep(2)
            }
            sleep(1000)
            btn=enter_acticity()
            btn.click()
        }else if(i<7){
            toastLog('等待任务界面中')
            sleep(1000)
        }else{
            toastLog('未找到，退出脚本')
            rexit()
        }
        i++
    }
    if(i>0){
        toastLog('已进入'+app[n_app%3][1]+'的任务界面')
    } 
    
    return true
}
function enter_acticity(){
    //进入活动界面
    let i=0,btn,btn2,btn3
    while(!(btn=text("做任务，领喵币").findOne(search_time*0.5))){
        //不是任务界面的话，进入任务界面
        if(btn2=descContains('搜索').findOne(search_time*0.5) ){
            btn2.click()
            className('android.widget.EditText').findOne(search_time).setText("618列车")
            btn3=text('搜索').clickable(true).findOne(search_time) || desc('搜索').clickable(true).findOne(search_time)
            btn3.click()
            sleep(10000)//等待10s进入活动界面
        }else if(i%5<4){
            toastLog('未找到活动界面，第'+(i+1)+'次等待中')
            sleep(1000)
            i++
        }else if(parseInt(i/6)<3){
            toastLog('等待太久，尝试返回')
            back()
            sleep(500)
            back()
            sleep(1000)
        }else{
            toast('请自己进入任务界面并重新运行脚本')
            rexit()
        }

    }    
    return btn
}
function open_app(packagename,name){
    name=arguments[1] ? arguments[1] : ''
    let i=0
    launch(packagename)
    sleep(5000)
    while(currentPackage() != packagename){
        //还没打开的话，退出脚本
        launch(packagename)
        sleep(2000)
        i++
        if(i>5){
            toast('请手动打开应用'+name+'，然后重新启动程序')
            rexit()
        }

    }
}
function enter_tianmao(){
    toastLog('待完成')
}   
//模拟浏览（浏览会场任务），存在按键返回1，否则返回0,judge_back为是否在浏览后返回
function view_main(keyword_view,keyword_back,judge_back,n){
    judge_back=arguments[2] ? arguments[2] : 1//judge_back默认为1，即默认在浏览后返回
    n=arguments[3] ? arguments[3] : n_time
    let btn=find_btn(keyword_view,1)
        btn.click()
        view(n)
        if(judge_back){
            toastLog('返回任务界面')
            back()
        }
}
//浏览
function view(n,keyword){
    n=arguments[0] ? arguments[0] :n_time
    keyword=arguments[1] ? arguments[1] :keyword_back
    let j=0
    while(j<n){
        if(find_btn(keyword)!=null){
            rsleep(1)
            return 0
        }
        rsleep(1) 
        rslide(2) 
        rsleep(1) 
        rslideR(1)         
        j++
    } 
}

//找到text或者desc包含文本s的按钮并返回，找不到返回null
function find_btn(s,judge_print){
    judge_print=arguments[1] ? arguments[1] :  0//判断是否输出日志
    let btn=null 
    for(let j=0 ;j<s.length; j++){

        if(textContains(s[j]).exists() ){
            btn = textContains(s[j]).findOnce(i) 
            if(judge_print){
                toastLog('找到了'+btn.parent().child(0).text()+' ，text为'+btn.text())
            }
            return btn
        }else if(descContains(s[j]).exists() ){
            btn = descContains(s[j]).findOnce(i) 
            if(judge_print){
                toastLog('找到了'+btn.parent().child(0).text()+' ，text为'+btn.text())
            }
            
            return btn
        }        
    }
    return btn
}
function find_btn_eq(s){
    //找到拥有完全相同text或desc的按钮
    var btn
    for(let j=0 ;j<s.length; j++){
        if(btn=text(s[j]).findOne(500)||desc(s[j]).findOne(500)){
            return btn
        }
    }
    return btn
}
//随机延时
function rsleep(n) {
    while (n--) {
        sleep(random(900, 1200)) 
    }
}

//随机向下划屏，持续1.2s-1.5s
function rslide(i) {
    while (i--) {
        let x1 = random(device.width*0.4, device.width*0.6) 
        let y1 = random(device.height*0.7, device.height*0.9) 
        let x2 = random(device.width*0.4, device.width*0.6) 
        let y2 = random(device.height*0.4, device.height*0.6) 
        swipe(x1, y1, x2, y2, 400) 
        rsleep(1) 
    }
}
//随机向上划屏，持续1.2s-1.5s
function rslideR(i) {
    while (i--) {
        let x1 = random(device.width*0.4, device.width*0.6) 
        let y1 = random(device.height*0.4, device.height*0.6) 
        let x2 = random(device.width*0.4, device.width*0.6) 
        let y2 = random(device.height*0.7, device.height*0.9) 

        swipe(x1, y1, x2, y2, 300) 
        rsleep(1) 
    }
}
//退出脚本
function rexit(){
    console.hide()
    exit()
}
