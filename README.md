# WCM8 Emulsify: Pattern Lab + Drupal 8

Component-driven prototyping tool using [Pattern Lab v2](http://patternlab.io/) automated via Gulp/NPM. Derived from Four Kitchens [Emulsify theme](https://github.com/fourkitchens/emulsify) starter kit. 

## Requirements

  1. [Node](https://nodejs.org/en/)
  2. [Gulp](http://gulpjs.com/)
  3. [Composer](https://getcomposer.org/)
  4. Optional: [Yarn](https://github.com/yarnpkg/yarn)
  
  WCM8 Emulsify supports both NPM and YARN.
  
---  

## Installation
  
### On a Composer-based Drupal 8 site <a name="install">

  1. Add Composer Installers to your site's Composer project if it isn't already required. `composer require composer/installers`
  2. Add this code to your site's composer.json repositories section:

    {
        "type": "vcs",
        "url": "git@code.osu.edu:ocio_odee_web/wcm8_emulsify.git"
    }

  3. Run `composer require ocio_odee_web/wcm8_emulsify dev-master`
  4. Enable WCM8 Emulsify `drush theme-enable wcm8_emulsify`
  5. Enable its dependencies `drush en components unified_twig_ext -y`
  6. Navigate to the root of your theme
  7. `npm install` or `yarn install`

### On a new WCM8 site
  1. The WCM8 Emulsify project will already be added to site via the WCM8 Base starterkit.
  2. Follow steps 4-7 [above](#install).

### On an existing WCM8 site with the theme already installed
1. Follow steps 6-7 [above](#install).

---

## Local Development
### Pattern Lab
#### Starting Pattern Lab and watch task

The `start` command spins up a local server, compiles everything (runs all required gulp tasks), and watches for changes.

  1. `npm start` or `yarn start`

#### Working with Pattern Lab components

To Do:
- How to add a new component
- How to style components
- Nested Patterns


### Drupal theme templates

#### How to wire Pattern Lab components to Drupal theme templates

To do:
- Explain how and when

#### How to create additional theme settings
Follow existing organizational and naming conventions.
1. Form components and theme setting variables are added within `wcm8_emulsify.theme`
2. Define default theme settings in `config/install/wcm8_emulsify.settings.yml` 
  
---

## Deploy for production
TBD

---
## Explain Theme Organization

To do:
1. BEM function
2. Drupal regions v. fixed-regions
3. How the wrapper mixin is applied
4. Chart comparing PL and Drupal components
5. More TBD


---

## Original Emulsify Documentation
Documentation is currently provided in [the Wiki](https://github.com/fourkitchens/emulsify/wiki). Here are a few basic links:

#### General Orientation

See [Orientation](https://github.com/fourkitchens/emulsify/wiki/Orientation)

#### For Designers (Prototyping)

See [Designers](https://github.com/fourkitchens/emulsify/wiki/For-Designers)

#### For Drupal 8 Developers

See [Drupal Usage](https://github.com/fourkitchens/emulsify/wiki/Drupal-Usage)

#### Gulp Configuration

See [Gulp Config](https://github.com/fourkitchens/emulsify/wiki/Gulp-Config)
