const db = require("./db");
const bt = require('./buttons')

class bodyService {
  constructor() {}
  
  // all 
  async issAdmin (uid){
    const chek = await db.count('config',{uid:uid,admin_status:1})
    if(chek > 0){return true}else{return false} 
  }
  async issUser (uid){
    const chek = await db.count('users',{uid:uid})
    if(chek > 0){return true}else{return false} 
  }


  // Pages
  async startPage (from,bot){
    const hello = await db.find('config',{name:"hello_text"})
    const button = await bt.menu(bot)
    const photo = await db.find('config',{name:"img_menu"})
    const photoArr = await [photo[0].fid,photo[0].fUniqId,photo[0].w,photo[0].h]
    const chek = await this.issUser(from.id)
    if(chek){return {hello, button, photoArr}}else{await this.addUser(from);return {hello, button, photoArr}}
  }


  // Добавляющие функции
  async addAdmin (from,code){
    if(code === process.env.PRIVATECOD){
        const chek = await db.count('config',{uid:from.id}) 
        if(chek > 0 ){
             return 3
        }else{
         const ct =  await db.insert('config',{uid:from.id,username:from.username,admin_status:1,fid:"0",fUniqId:"0",w:0,h:0,i_title:"0",i_description:"0",i_price:"0"})
         if(ct === true){
             const start_nastr = await db.count('config',{}) 
             if(start_nastr === 1){
                 return 1
             }else{
                return 2
             }
         }
        }    
     }else{
        return 0
     }
  }
  async addUser (data,lastMess){
    const chek =  await db.count('users',{uid:data.id})
    if(chek > 0 ){
      const up = await this.updateLastMess(data.id, lastMess)
      return up
    }else{
      const aU =  await db.insert('users',{uid:data.id,username:data.username,first_name:"0",tell:0,email:"0",adress:"0",last_mess:lastMess})
      return aU
    }
    
  }
  async addItem (id){
    const chek = await this.issAdmin(id)
    if(chek){
      const data = await db.find('config',{uid:id})
      const counts = await db.count('catalog',{})
      console.log(counts)
      let num = counts+1
      console.log(num)
      const adder = await db.insert('catalog',{id:num,title:data[0].title,fId:data[0].fId,fUnicId:data[0].fUnicId,w:data[0].w,h:data[0].h,description:data[0].description,price:data[0].price})
      return adder
    }
  }
  async addKorz (uid,itemId){
    const add = await db.insert('korzina',{uid,itemId})
    const count = await this.getCountKorz(uid)
    return count
  }
  //update
  async updateLastMess(idd,id_mess){
    const upp = await db.update('users',{uid:idd}, {last_mess:id_mess})
    return upp
  }
  async updateImg(id,fId,fUnicId,w,h,XXX){
    const chek = await this.issAdmin(id)
    const countImg = await db.count('config',{name:"img_menu"})
    if(chek){
      if(XXX === 1){
        if(countImg === 1){
          const upp = await db.update('config',{name:"img_menu"},{fid:fId,fUniqId:fUnicId,w,h})
          return upp
        }else{
          const upp = await db.insert('config',{name:"img_menu",fid:fId,fUniqId:fUnicId,w,h})
          return upp
        }
      }else{
        const upp = await db.update('config',{uid:id},{fId,fUnicId,w,h})
        return upp
      }
    }
  }
  async updateTite(id,title){
    const chek = this.issAdmin(id)
    if(chek){
      const upp = await db.update('config',{uid:id},{title})
      return upp
    }
  }
  async updateDescription(id,description){
    const chek = this.issAdmin(id)
    if(chek){
      const upp = await db.update('config',{uid:id},{description})
      return upp
    }
  }
  async updatePrice(id,price){
    const chek = this.issAdmin(id)
    if(chek){
      const nPrice = Number(price)
      const upp = await db.update('config',{uid:id},{price:nPrice})
      return upp
    }
  }
  //get
  async getHello(){
    const hello = await db.find('config',{name:"hello_text"})
    return hello[0].text
  }

  async getCountKorz (uid){
    const count = await db.count('korzina',{uid})
    return count
  }
  async getCountItems (){
    const count = await db.count('catalog',{})
    return count
  }

  async getItem (idItem){
    const countItem = await db.count('catalog',{})
    if(countItem === 0 ){
      return false
    }else{
      if(idItem > countItem || idItem < 0){
        const item = await db.find('catalog',{id:1})
        return item[0]
      }else{
        const item = await db.find('catalog',{id:idItem})
        return item[0]
      }
      
    }
  }

  async getLastMess(uid){
    const chek =  await db.count('users',{uid:uid})
    if (chek > 0 ){
      const otvet = await db.find('users',{uid:uid})
      return otvet[0].last_mess
    }else{
      return 0
    } 
  }

  async getTestItem(uidd){
    const chek = await db.find('config',{uid:uidd})
    return chek[0]
  }

  //dell
  async dellKorz (uid,itemId){
    const isss = this.issAdmin(uid)
    if(isss){
      const dell = await db.deleteOne('korzina',{uid,itemId})
      const count = await this.getCountKorz(uid)
      return count
    }
  }
  async dellItem (uid,itemId){
    const isss = this.issAdmin(uid)
    if(isss){
      const dell = await db.deleteOne('catalog',{id:itemId})
      const dellCount = await this.generateNameItems(uid)
      return dellCount
  
    }
  }
  //Генератор корзины
  async generateKorz(uid,bot){
    const plBt = await bt.pay(bot)
    const idder = await db.find('korzina',{uid})
    const count = idder.length-1
    const items = []
    let text = ''
    for(let i = 0; i <= count; i++){
      let data = await db.find('catalog',{id:idder[i].itemId})
      items.push({label:data[0].title,amount:data[0].price*100})
      text +=`${i+1}. ${data[0].title},`
    }
    const datter = await {count,items,text,plBt}
    return await datter
  }
  async generateNameItems(uid){
    const iss = await this.issAdmin(uid)
    const data = await db.find('catalog',{})
    for(let i = 1; i < data.length; i++){
      let z = i-1
      const newName = await db.update('catalog',{fId:data[z].fId},{id:i})
    }
    const genCount = await this.getCountItems()
    return genCount
  }
  
}

module.exports = {
    bodyService,
}