/**
 * 点击节点展开
 * @param {*} id
 */
 export const expendNodes = (id)=>{
     //debugger
    return new Promise((resolve,reject)=>{
        let totalList = []
        //拆除来所有的children到第一层
        data.forEach(item=>{
            getDeepChildrens(totalList,item,0)
        })

        let list = []
        for(let item of totalList){
            if(item.parentId.toString() === id){
                const {children,...reset} = item
                list.push({
                    ...reset
                })
            }
        }
        if(list.length>0){
            resolve(list)
        }else{
            reject()
        }

    })

}
