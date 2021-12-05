// Create New Wallet button click
$('#import-wallet').css("display","none");

$("#create-wallet").click(function() {
  $("#old-wallet").hide();
  $("#new-wallet").show();
  $('#output-area').html(generateWalletUI());
  var sendXMRBtn = document.getElementById('sendXMRBtn');
  sendXMRBtn.addEventListener('click',() => {sendXMR();})
  monero.getXMRAddress().then(address => { document.getElementById('xmr-address').innerHTML = `<span>Address</span>: ${address}`; });
  updateXmrBalance();
})

async function sendXMR() {
  const InpNumb = document.getElementById('xmrAmountSent');
  const InpAddr = document.getElementById('xmrAddressSent');
  const Numb = await parseFloat(InpNumb.value);
  const Addr = await InpAddr.value;
  monero.sendXMR(Addr,Numb).then(txData => displayAlert('success','Transaction Succeeded ['+`${txData.txhash}`+']')).catch((err) => displayAlert('danger',err));
}

var IntAddressArea = document.getElementById('IntAddress');
async function makeIntAddress() {
  monero.makeIntegratedAddress().then(output => {
    IntAddressArea.innerText = `PaymentID: ${output.paymentID}\nIntegrated Address: ${output.intAddress}`;
  })
}

var makeAddressBtn = document.getElementById('MakeXMRWallet');
makeAddressBtn.addEventListener('click',() => {makeIntAddress();})

//==============================
// Helper Functions
//==============================

function displayAlert(type, msg) {
  var alert = `
    <div class='alert alert-dismissible alert-${type}'>
      <p>${msg}</p>
      <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    </div>
  `;
  $('#alert-msg').append(alert);
}

function generateWalletUI() {
  var html = `
    <h5 id='xmr-balance'><u>Balance</u>: 0</h5>
    <h5 id='xmr-address'></h5>
    <h5><u>Send Transaction</u></h5>
    <form id='tx-form'>
      <div class='form-group'>
        <input type='number' min='0' step='any' name='xmr' placeholder='Amount in XMR' class='form-control' id='xmrAmountSent'>
        <input type='text' name='addr' placeholder='Recipient Address' class='form-control' id='xmrAddressSent'>
      </div>
      <button type='button' class='btn btn-warning' id="sendXMRBtn"'>Send Monero</button>
    </form>
  `;
  return html;
}

function updateXmrBalance() {
  monero.getXMRBalance().then((balance) => { $('#xmr-balance').html("<u>Balance</u>: " + balance + " XMR"); })
}