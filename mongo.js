const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.mljahkk.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name : String,
    number : String
})

const Listing = mongoose.model('Listing',phoneSchema)
if(process.argv.length === 5){
    const listing = new Listing({
        name : process.argv[3],
        number : process.argv[4]
    })
    listing.save().then(result =>{
        
        console.log(`added ${result.name} number ${result.number} 
            to phonebook`)

        mongoose.connection.close()
    })
}else if(process.argv.length === 3){
    Listing.find({}).then(result=>{
        console.log('phonebook: ')
        result.forEach(item=>{
            console.log(`${item.name} ${item.number}`)
        })
        mongoose.connection.close()

    })

}




