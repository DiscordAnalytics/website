import * as EnAuth from './en/pages/auth.json'
import * as FrAuth from './fr/pages/auth.json'
import * as EnHome from './en/pages/home.json'
import * as FrHome from './fr/pages/home.json'
import * as EnBlog from './en/pages/blog.json'
import * as FrBlog from './fr/pages/blog.json'

import * as EnNavBar from './en/components/navbar.json'
import * as FrNavBar from './fr/components/navbar.json'
import * as EnFooter from './en/components/footer.json'
import * as FrFooter from './fr/components/footer.json'

export const maintainedLocales = ['en', 'fr']

export const english = {
  components: {
    navbar: EnNavBar,
    footer: EnFooter,
  },
  pages: {
    auth: EnAuth,
    blog: EnBlog,
    home: EnHome,
  },
}

export const french = {
  components: {
    navbar: FrNavBar,
    footer: FrFooter,
  },
  pages: {
    auth: FrAuth,
    blog: FrBlog,
    home: FrHome,
  },
}
