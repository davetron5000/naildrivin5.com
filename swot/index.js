class OneSWOT {
  constructor(element, location, open) {
    this.element  = element
    this.location = location
    this.id       = element.dataset.swot

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
    const anchor = location.hash.substr(1)
    if (open) {
      this.show(false)
    }
    else if (anchor == this.id) {
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
      this.location.hash = this.id
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
  constructor(body, window, open) {
    this.body       = body
    this.window     = window
    this.themeNames = []
    this.open       = open

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

    const url_params = new URLSearchParams(window.location.search);
    const theme = url_params.get("theme")

    if (theme && this.themeNames.indexOf(theme) >= 0) {
      this.switchToTheme(theme)
    }
    else {
      this.switchToTheme(this.themeNames[0])
    }
  }

  switchToTheme(themeName) {
    this.themeNames.forEach( (name) => {
      this.body.classList.remove(name)
    })
    this.body.classList.add(themeName)
    const url_with_theme = this.window.location.protocol + "//" + 
      this.window.location.host + 
      this.window.location.pathname + `?theme=${themeName}&open=${this.open}`;
    this.window.history.pushState({theme: themeName},"",url_with_theme)

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

document.addEventListener("DOMContentLoaded", () => {
  let swots = []

  const url_params = new URLSearchParams(this.location.search);
  const open = url_params.get("open") === "true"

  document.querySelectorAll("[data-swot]").forEach( (element) => {
    swots.push(new OneSWOT(element,location,open))
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

  let themeLinks = {}

  const themer = new Themer(document.body, window, open)
})

