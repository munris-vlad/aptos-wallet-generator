import { AptosAccount } from 'aptos'
import { Wallet } from 'ethers'
import { createObjectCsvWriter } from 'csv-writer'

const csvWriter = createObjectCsvWriter({
    path: 'wallets.csv',
    header: [
        { id: 'address', title: 'address'},
        { id: 'privatekey', title: 'private key'},
        { id: 'mnemonic', title: 'mnemonic'},
    ]
})

const args = process.argv.slice(2)
const count = args[0]
let csvData = []

async function generateAptosWallet() {
    const seed = Wallet.createRandom();
    let wallet = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", seed.mnemonic.phrase)
    let aptosWallet = wallet.toPrivateKeyObject()
	csvData.push({
		address: aptosWallet.address,
		privatekey: aptosWallet.privateKeyHex,
		mnemonic: seed.mnemonic.phrase
	})
}

function generateWallets() {
	for (var i = 0; i < count; i++) {
		generateAptosWallet()
	}
}

async function main() {
	await generateWallets()
	csvWriter.writeRecords(csvData)
        .then(() => console.log('Запись в CSV файл завершена'))
        .catch(error => console.error('Произошла ошибка при записи в CSV файл:', error))
}

main()