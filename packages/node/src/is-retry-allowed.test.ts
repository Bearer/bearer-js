import isRetryAllowed from './is-retry-allowed'

class TestError extends Error {
  public code: string = ''
}

describe.each([
  [
    'ENETUNREACH',
    'ENOTFOUND',

    // SSL errors from https://github.com/nodejs/node/blob/e585caa2bebbd238c763af588a40879b61cf240f/src/node_crypto.cc#L2563-L2589
    'UNABLE_TO_GET_ISSUER_CERT',
    'UNABLE_TO_GET_CRL',
    'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
    'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
    'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
    'CERT_SIGNATURE_FAILURE',
    'CRL_SIGNATURE_FAILURE',
    'CERT_NOT_YET_VALID',
    'CERT_HAS_EXPIRED',
    'CRL_NOT_YET_VALID',
    'CRL_HAS_EXPIRED',
    'ERROR_IN_CERT_NOT_BEFORE_FIELD',
    'ERROR_IN_CERT_NOT_AFTER_FIELD',
    'ERROR_IN_CRL_LAST_UPDATE_FIELD',
    'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
    'OUT_OF_MEM',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'SELF_SIGNED_CERT_IN_CHAIN',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'CERT_CHAIN_TOO_LONG',
    'CERT_REVOKED',
    'INVALID_CA',
    'PATH_LENGTH_EXCEEDED',
    'INVALID_PURPOSE',
    'CERT_UNTRUSTED',
    'CERT_REJECTED'
  ]
])('.isRetryAllowed({ code: %s })', code => {
  it('returns false', () => {
    const error = new TestError()
    error.code = code
    expect(isRetryAllowed(error)).toBeFalsy()
  })
})

describe.each([
  ['ETIMEDOUT', 'ECONNRESET', 'EADDRINUSE', 'ESOCKETTIMEDOUT', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'EAI_AGAIN']
])('.isRetryAllowed({ code: %s })', code => {
  it('returns true', () => {
    const error = new TestError()
    error.code = code
    expect(isRetryAllowed(error)).toBeTruthy()
  })
})
