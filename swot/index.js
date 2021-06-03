class OneSWOT {
  constructor(element, anchor, open, onOpen) {
    this.element = element
    this.anchor  = anchor
    this.onOpen  = onOpen
    this.id      = element.dataset.swot

    if (!this.id) {
      throw "Element had data-swot but without a value"
    }

    this.details   = this._requireElement("section")
    this.showLink  = this._requireElement("[data-show-link]")
    this.hideLink  = this._requireElement("[data-hide-link]")
    this.permaLink = this._requireElement("[data-permalink]")

    this.showLink.onclick = (event) => {
      event.preventDefault()
      this.show()
    }
    this.hideLink.onclick = (event) => {
      event.preventDefault()
      this.hide()
    }
    if (open) {
      this.show(false)
    }
    else if (this.anchor == this.id) {
      this.show()
    }
  }

  _requireElement(selector) {
    const element = this.element.querySelector(selector)
    if (!element) {
      throw `Expected to find ${selector} but didn't`
    }
    return element
  }

  show(set_anchor=true) {
    this.details.classList.add("db")
    this.details.classList.remove("dn")
    this.permaLink.classList.add("di")
    this.permaLink.classList.remove("dn")
    this.showLink.classList.add("dn")
    this.showLink.classList.remove("di")
    if (set_anchor) {
      this.onOpen(this.id)
    }
  }
  hide() {
    this.details.classList.add("dn")
    this.details.classList.remove("db")
    this.permaLink.classList.add("dn")
    this.permaLink.classList.remove("di")
    this.showLink.classList.add("di")
    this.showLink.classList.remove("dn")
  }
}

class Themer {
  constructor(body, initialTheme, onChange) {
    this.body       = body
    this.themeNames = []
    this.onChange   = onChange

    this.body.querySelectorAll("[data-theme]").forEach( (link) => {
      const themeName = link.dataset.theme
      if (!themeName) {
        throw "Element had a data-theme but no value"
      }
      this.themeNames.push(themeName)
      link.onclick = (event) => {
        event.preventDefault()
        this.switchToTheme(themeName)
      }
    })

    this.theme = this.themeNames[0]
    if (initialTheme) {
      if (this.themeNames.indexOf(initialTheme) != -1) {
        this.theme = initialTheme
      }
      else {
        console.log(`No such theme ${initialTheme}`)
      }
    }

    this.switchToTheme(this.theme)
  }

  switchToTheme(themeName) {
    this.themeNames.forEach( (name) => {
      this.body.classList.remove(name)
    })
    this.body.classList.add(themeName)
    console.log(`this.body.classList.add(${themeName})`)

    if (themeName == "dryerase") {
      document.querySelectorAll("h3").forEach( (element) => {
        const rotate = (Math.random() * 4) - 2
        const skew   = (Math.random() * 4) - 2
        element.style.transform = `rotate(${rotate}deg) skew(${skew}deg)`
        element.classList.add(`dryerase-${this._randomColor()}`)
      })
      document.querySelectorAll("h2").forEach( (element) => {
        const rotate = (Math.random() * 4) - 2
        const skew   = (Math.random() * 4) - 2
        element.style.transform = `rotate(${rotate}deg) skew(${skew}deg)`
      })
      document.querySelectorAll("p").forEach( (element) => {
        const space = (Math.random() * 2) - 1
        element.style.letterSpacing = `${space}px`
        const rotate = (Math.random() * 2) - 1
        const skew   = (Math.random() * 2) - 1
        element.style.transform = `rotate(${rotate}deg) skew(${skew}deg)`
        element.classList.add(`dryerase-${this._randomColor()}`)
      })
    }
    else {
      document.querySelectorAll("h3").forEach( (element) => {
        element.style.transform = `rotate(0deg) skew(0deg)`
      })
      document.querySelectorAll("h2").forEach( (element) => {
        element.style.transform = `rotate(0deg) skew(0deg)`
      })
      document.querySelectorAll("p").forEach( (element) => {
        element.style.letterSpacing = "normal"
        element.style.transform = `rotate(0deg) skew(0deg)`
      })
    }
    this.onChange(themeName)
  }

  _randomColor() {
    const colors = [
      "red",
      "blue",
      "purple",
      "green",
    ]
    return colors[Math.floor(Math.random() * 4)]
  }
}

class SWOTUrl {
  constructor(location) {
    const url_params = new URLSearchParams(location.search);

    this.anchor = location.hash.substr(1)
    this.theme  = url_params.get("theme")
    this.open   = url_params.get("open") === "true"
  }


  updateURL(state, window) {
    const query_string = `?theme=${this.theme}&open=${this.open}#${this.anchor}`
    const new_url = window.location.protocol + "//" +
      window.location.host + 
      window.location.pathname + query_string
    window.history.pushState(state,"",new_url)
  }

}

document.addEventListener("DOMContentLoaded", () => {
  let swots = []

  const swotURL = new SWOTUrl(window.location)

  const onThemeChange = (themeName) => {
    swotURL.theme = themeName
    swotURL.updateURL({ theme: themeName }, window)
  }

  const onOpen = (anchor) => {
    swotURL.anchor = anchor
    swotURL.updateURL({ anchor: anchor }, window)
  }

  document.querySelectorAll("[data-swot]").forEach( (element) => {
    swots.push(new OneSWOT(element,swotURL.anchor,swotURL.open, onOpen))
  })
  document.querySelectorAll("[data-show-all]").forEach( (element) => {
    element.onclick = (event) => {
      event.preventDefault()
      swots.forEach( swot => swot.show(false) )
      location.hash = ""
    }
  })
  document.querySelectorAll("[data-hide-all]").forEach( (element) => {
    element.onclick = (event) => {
      event.preventDefault()
      swots.forEach( swot => swot.hide() )
    }
  })

  const themer = new Themer(document.body, swotURL.theme, onThemeChange)

})

