var fs = require('fs') //引入文件系统模块
var Crawler = require('crawler') // 引入数据抓取模块
// 读取文件或目录状态
fs.stat('./data',function(err,stats){
    if(err){
        console.log(err)
        fs.mkdir('./data')
        console.log('创建文件夹成功')
    }
    else{
        console.log(stats)
        console.log('文件夹已存在')
    }
})
// 创建实例
var c = new Crawler({
    maxConnections : 10
})
var books = [] // 存储当前的书籍数据
c.queue([
    {
        uri:'http://bang.dangdang.com/books/newhotsales/01.00.00.00.00.00-recent7-0-0-1-1',
        callback : function(err,res,done){
            if(error){
                console.log(error)
            }
            else{
                var $ = res.$
                $('.bang_list li').each(function(){
                    convertToBook($(this))
                })
                console.log(books)
            }
            done;
        }
    }
])
function convertToBook(tagBook){
    var obj = {}
    obj.title = tagBook.find('.name a').text()
    obj.author = tagBook.find('.publisher_info').eq(0).find('a').attr('title')
    obj.img = tagBook.find('.pic img').attr('src')
    obj.link = tagBook.find('.pic a').attr('href')
    //转换价格数据为数字值
    //js中字符串转换为数字 *1或者Number(str)
    obj.price = tagBook.find('.price_n').eq(0).text().replace('¥','')*1
    obj.publisher = tagBook.find('.publisher_info').eq(1).find('a').text()
    books.push(obj)
}