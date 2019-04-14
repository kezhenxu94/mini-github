const http = require('http.js')

const parseLinks = header => {
  if (!header || header.length == 0) {
    return {}
  }
  const links = {}

  const parts = header.split(',')
  parts.map(p => {
    const section = p.split(';')
    if (section.length != 2) {
      throw new Error("section could not be split on ';'")
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim()
    const name = section[1].replace(/<(.*)>/, '$1').trim()

    links[name] = url
  })

  return links
}

const wrap = promise => new Promise((resolve, reject) => {
  promise.then(({ status, headers, data }) => {
    console.info({ status, headers, data })
    if (status !== 200) {
      return reject(new Error('status !== 200'))
    }
    const links = parseLinks(headers.link)
    const nextUrl = links['rel="next"']
    if (nextUrl) {
      return resolve({
        data,
        next: () => wrap(http.get(nextUrl))
      })
    }
    return resolve({ data, next: null })
  }).catch(error => reject(error))
})

module.exports = {
  wrap
}