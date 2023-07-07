const requests = document.getElementsByClassName('Request');
// console.log(requests)

for(request of requests){
    request.addEventListener('click',(e)=>{
        e.target.className='disable'
        e.target.innerHTML="Requested"
    })
}

const cardrequests=document.getElementsByClassName("cardrequest");

for(cardrequest of cardrequests){
    cardrequest.addEventListener('click',(e)=>{
        e.target.className='disable'
        e.target.innerHTML="Requested ✅"
    })

}