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

// getBooks('经济','http://bang.dangdang.com/books/newhotsales/01.25.00.00.00.00-recent7-0-0-1-1',5)
// getBooks('儿童','http://bang.dangdang.com/books/newhotsales/01.41.00.00.00.00-recent7-0-0-1-1',5)
//http://bang.dangdang.com/books/newhotsales/01.00.00.00.00.00-recent7-0-0-1-

var bookList = [{
    url:'http://bang.dangdang.com/books/newhotsales/01.25.00.00.00.00-recent7-0-0-1-1',
    name:'经济',
    code:'jingji',
    pageCount:'5'
},{
    url:'http://bang.dangdang.com/books/newhotsales/01.41.00.00.00.00-recent7-0-0-1-1',
    name:'儿童',
    code:'ertong',
    pageCount:'5'
}]
bookList.forEach(function (item) {  
    getBooks(item.code,item.url,item.pageCount)
})
function getBooks(type,url,pageCount){
    getBookData(
        url,
        1,
        5
    )
    var books = [] // 存储当前的书籍数据
    /*
    * baseUrl    基础地址 用于拼接实际的地址时使用
    * page       当前页码
    * pageCount  总页数
    */
    function getBookData(baseUrl,page,pageCount){
        var url = baseUrl + page // 实际取数据的地址
            c.queue([
            {
                uri:url,//'http://bang.dangdang.com/books/newhotsales/01.00.00.00.00.00-recent7-0-0-1-1',
                callback : function(err,res,done){
                    if(err){
                        console.log(err)
                    }
                    else{
                        var $ = res.$
                        $('.bang_list li').each(function(){
                            // 解析book数据存储在数组中
                            books.push(convertToBook($(this)))
                        })
                        if(page<=pageCount){
                            getBookData(baseUrl,page+1,pageCount)
                        }
                        else{
                            fs.writeFile(`./data/book_${type}.json`,JSON.stringify(books))
                            console.log(`写入文件完成...book_${type}.json`)
                        }
                        
                    }
                    done;
                }
            }
        ])
    }
}



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
    return obj
    // books.push(obj)
}