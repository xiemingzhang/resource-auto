#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
// const readline = require('readline');

const options = require('minimist')(process.argv.slice(2))

const optionsName = require('minimist')(process.argv.slice(2), {
    string: ['add']
})

if (options._.length === 0 && (options.v || options.version)) {
    console.log('resource-auto: ' + require('./package.json').version)
    process.exit()
}

if (options._.length === 0 && (options.h || options.help)) {
    console.log([
        '',
        '  Usage: resource-auto [command] [options]',
        '',
        '',
        '  Commands:',
        '',
        '  c || create <> generates __resource.js',
        // '   add <folderDirectory> append resource to __resource.js',
        '',
        '  Options:',
        '',
        '    -h, --help    output usage information',
        '    -v, --version output the version number',
        ''
    ].join('\n'))
    process.exit(0)
}

if (options._.length === 0 && (options.c || options.create)) {
    console.log('generates source to __resource.js')
    var root = path.resolve();
    let string = `res = {
//游戏图片
`
    fs.writeFileSync(root + '/__resource.js', string, "utf-8");

    appendObjArr(root + '/res/Normal/source')

    fs.appendFileSync(root + '/__resource.js', '\n//audio\n', "utf-8")

    appendObjArr(root + '/res/Normal/audio')
    // appendObjArr(root + '/res/Normal/common')

    // generateResource(objArr)
    // process.exit(0)
    fs.readFile(root + '/__resource.js', 'utf-8', function(err, data){
        // data = data.replace(/,&/, '')
        console.log(data.slice(0, data.length-2))

        fs.writeFileSync(root + '/__resource.js', data.slice(0, data.length-2) + '\r}', "utf-8")
        console.log('__resource.js finished')

    })
}  

function appendObjArr(name){
    var objArr = []
    let root = path.resolve()
    let thePath = name

    try{
        var paths1 = fs.readdirSync(thePath);
    }catch(e){
        //捕获异常
        // console.log(`/res${thePath.split('/res')[1]}目录不存在`)
        console.log(`${thePath}目录不存在`)
        return
    }

    paths1.forEach(_path => {
        if(!fs.statSync(thePath + '/' + _path).isFile()){
            // console.log(thePath + '/' + _path)
            appendObjArr(thePath + '/' + _path)   
        }else{
            let pic1 = /\.(png)/g;
            let pic2 = /\.(jpg)/g;
            let pic3 = /\.(mp3)/g;
            if(pic1.test(_path) || pic1.test(_path) || pic3.test(_path)){
                if(thePath.split('/res/Normal')[1].split('/')[1] === 'source'){
                  objArr.push({
                    name: `${thePath.split('/res/Normal')[1].split('/').length > 2 ? thePath.split('/res/Normal')[1].split('/').slice(2).join('_') + '_' : ''}${_path.split('.')[0]}`,
                    path: `'${thePath.split('/Normal').reverse()[0] + '/' + _path}'`
                  })
                }
                if(thePath.split('/res/Normal')[1].split('/')[1] === 'audio'){
                  objArr.push({
                    name: `${thePath.split('/res/Normal')[1].split('/').length > 2 ? thePath.split('/res/Normal')[1].split('/').slice(2).join('_') + '_' : 'audio_'}${_path.split('.')[0]}`,
                    path: `'${thePath.split('/Normal').reverse()[0] + '/' + _path}'`
                  })
                }
                if(thePath.split('/res/Normal')[1].split('/')[1] === 'common'){
                  objArr.push({
                    name: `${thePath.split('/res/Normal')[1].split('/').length > 2 ? 'common_' + thePath.split('/res/Normal')[1].split('/').slice(2).join('_') + '_' : 'common_'}${_path.split('.')[0]}`,
                    path: `'${thePath.split('/Normal').reverse()[0] + '/' + _path}'`
                  })
                  // generateResource(objArr, 1)
                }
            }else{
              console.log(`/res${thePath.split('/res')[1]}/${_path}:类型错误`);
            }
        }
    });

    generateResource(objArr)
}

function generateResource(objArr){
    let root = path.resolve()
    if(objArr.length !== 0){
        objArr.forEach(function(item, index) {
          // if(index === objArr.length - 1){
            // console.log('__resource.js finished')
            // var _str = `${item.name}: ${item.path}\r`
          // }else{
            var _str = `${item.name}: ${item.path},\n`
          // }
          fs.appendFileSync(root + '/__resource.js', _str, "utf-8")
        })
    }
    // else{
    //     fs.appendFileSync(root + '/__resource.js', '\r}', "utf-8")
    // }
}

// if (options._.length === 0 && options.add) {
//     console.log('append __resource.js')
//     let root = path.resolve();
//     let string = `res = {
// //source图片
// `
//     fs.writeFileSync(root + '/__resource.js', string, "utf-8");

//     if(optionsName.add){
      
//     }else{
//       console.log('default project is cocosjsProj')
//       init('cocosjs-project')
//     }
// }
