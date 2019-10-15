import crypto from 'crypto'

// temporary one
const BEARER_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwua7mGIbBl+6tgXhmJmY
4GS95C8gmt9PyTNMV6IK5F1/gHmofrAbF61IDZFmffeEFioQpWYSKH59moTin+s8
aOAfQxKz6PXLciIYszgZTVxYa4edYso5J2OtuHhM2b5KFHDkApvvdLmmsdeoiNit
m8iUtOUyToaPtquYO6XgOqbIgm/B6FbI3N1WR0U4RzEOPbUsN549DF9ZF3N0sNx3
nRJrlwKWwIvCYwImGvDNOP6Es3wgWv7TZoAZPaZ6rviTxEp97XWN70T28+fqFcZx
lSyzd/vqyH6gp3gMqBtWGJyoxQ/W8VS9WF6sHGBkW9k5KUYn7miqxpCbOgTfGhUu
5xJxoo5FEo4YdL3o6hiSI/s5mGAPdz/+JiIJ1YeV39nZAcSdBvJtwP1QI+FoeasT
Htr/LEZ3QxZFT/X+5SgCKoqzGwgpG5FFteGmHAMXo8K0sT8mQ3gXyahxqGZKubiK
TlKsTxfFoQkETH+tfztHB0qNNvINDAtoCLcnuZV7oKOn09GK09DtU5dyhu26e+pw
Um7b6Unmz2Sh7uMVKFbeSYjKZJI9dDZ4Ry1x38c5DOtCyc5KKMSA3nC9oF6b2Ej3
HNmJ2NR7IEkHMBfwAzjv4Lq6ubNVOfGmESIK/jzdQqc05P2OLKoiufZMnSCMw30V
nP0XsVXDjGLnic1h8Bf7RfkCAwEAAQ==
-----END PUBLIC KEY-----`

export const isBearerMessage = (message: string, messageSignature: string) => {
  const signature = new Buffer(messageSignature, 'base64')
  const verify = crypto.createVerify('sha512')
  verify.update(message)
  return verify.verify(BEARER_PUBLIC_KEY, signature)
}
