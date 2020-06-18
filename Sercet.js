/**
 *
 * @param name
 * @param type 2：长期，1：短期
 * @returns {string}
 */
function buildPass(name,type) {
    var raw="cll&cq-";
    if(type==1)raw="cq&cll-";
    var now=new Date();
    var password=raw+now.getTime()+"-"+name;
    return btoa(password);
}

buildPass("xxxxx",1)
function verityPass(password){
    try{
        var pl=atob(password).split("-");
        if(pl[0]=="cq&cll"){
            var time=new Date(parseInt(pl[1]))
            var now=new Date();
            if((Math.abs(time-now))<=300000){
               return 1;
            }
        }
        if(pl[0]=="cll&cq"){
            var time=new Date(parseInt(pl[1]))
            var now=new Date();
            if((Math.abs(time-now))<=300000){
                return 2;
            }
        }
        return 0;
    }catch (e) {
        return 0;
    }

}
