<div id="content" class="govuk-main-wrapper" role="main">

<span id="Top"></span>

<div id="manuals-frontend">

<div class="govuk-grid-row">

<div class="govuk-grid-column-full">

<div id="section-title" class="gem-c-heading govuk-!-margin-bottom-4">

# Technical content A to Z

</div>

</div>

<div class="govuk-grid-column-two-thirds">

The technical content style guide covers the style, structure and terms
you should use when writing content for technical users on GOV.UK.

</div>

<div class="govuk-grid-column-two-thirds">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

<div class="call-to-action">

This page will be unpublished soon. There’s a new version of this
content in the <a
href="https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/technical-a-to-z/"
rel="external">GOV.UK content and publishing guidance</a>.

</div>

</div>

<div id="default-id-ace3fa1c"
class="gem-c-accordion govuk-accordion govuk-!-margin-bottom-6"
module="govuk-accordion gem-accordion ga4-event-tracker"
ga4-expandable="" anchor-navigation="true" show-text="Show"
hide-text="Hide" show-all-text="Show all sections"
hide-all-text="Hide all sections"
this-section-visually-hidden=" this section">

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-1" class="govuk-accordion__section-button">About the technical content style guide</span>

</div>

<div id="default-id-ace3fa1c-content-1"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;About the technical content style guide&quot;,&quot;index_section&quot;:1,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

It’s important that teams in government explain their technology clearly
and concisely.

There’s a wide variety of people in government working on technical
content that’s published on GOV.UK, external sites like the
<a href="https://www.ncsc.gov.uk/" rel="external">National Cyber
Security Centre (NCSC)</a>, GitHub and beyond. A full technical style
guide helps make technical content more consistent and usable across
government.

Check the [GOV.UK style
guide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style)
first for style conventions that apply to all content.

### Background

This style guide builds on:

- existing GOV.UK style, content and accessibility guidance
- evidence from user research
- using the plainest language possible, avoiding idioms and ambiguous
  terms
- existing style from user-focused style guides such as the
  <a href="https://developers.google.com/style" rel="external">Google
  developer documentation style guide</a>

You can search the style guide by:

1.  Selecting ‘show all sections’.
2.  Pressing Ctrl+f on your keyboard if you’re using a PC or ⌘+f if
    you’re using a Mac.
3.  Typing the word or search term that you’re looking for.

### Suggest a change or addition

If you have a suggestion for a new style point, or you have evidence
that an existing style point does not meet the needs of users, email
<technical-writers@digital.cabinet-office.gov.uk>.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-2" class="govuk-accordion__section-button">A </span>

</div>

<div id="default-id-ace3fa1c-content-2"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;A &quot;,&quot;index_section&quot;:2,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### API

Do not expand the abbreviation for technical users.

### API endpoints

Use `methodname endpoint` for an API endpoint. Do not include the base
path. Use {CAPS_WITH_UNDERSCORES_INSIDE_CURLY_BRACKETS} for placeholder
parameters in endpoints.

For example:

GET /v1/payments/{PAYMENT_ID}/{REFUND_ID}

Replace:

- `{PAYMENT_ID}` with the ID of the payment you’re checking
- `{REFUND_ID}` with the ID of the refund you’re checking

### API headers

There are lots of HTTP and API headers, so use code style and the exact
name of API headers, to make it clear which header you mean. For
example:

- `Authorisation` header
- `Content-type` header - not `Content header` because there are several
  different content headers

Example:

You must include an `Authorisation` header in your request.

### API key

Do not expand the abbrevation for technical users. Use:

- create an API key - not generate
- revoke an API key

### API parameters and fields

Use:

- parameter for API request items, not ‘option’
- field for API response items, not ‘variable’
- object, not ‘dictionary’ or ‘array’ - for example: If the `status` in
  the `refund_summary` object is `available`…
- key
- value
- key-value pair

Parameters are required or optional. Do not use ‘you do not need’ (which
is ambiguous) or  ‘you can leave out’.

### API requests

Use ‘API request’ not ‘API call’.

Tell users they can ‘include’ a parameter in an API request, not that
they can ‘supply’ a parameter.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-3" class="govuk-accordion__section-button">B</span>

</div>

<div id="default-id-ace3fa1c-content-3"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;B&quot;,&quot;index_section&quot;:3,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### backend

Not “back-end” or “back end”.

### bold

Only use [bold in text from
interfaces](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#bold).

### breaking changes

‘Breaking changes’ are changes to one part of your software system that
may cause other parts to fail. Do not use this term without explaining
it -  user research shows not all technologists immediately understand
what it means.  

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-4" class="govuk-accordion__section-button">C</span>

</div>

<div id="default-id-ace3fa1c-content-4"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;C&quot;,&quot;index_section&quot;:4,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### choose

Use ‘choose’ where there’s a genuine choice (like ‘choose what time you
want your appointment’) and ‘select’ when you’re indicating the
appropriate response (like ‘select your year of birth’).

### Cloud First policy

Capitalise Cloud First.

### Cloud Security Principles

Upper case. 

### code samples

Format code samples or excerpts in a fixed width font. You usually do
this by adding either:

- backticks (\`\`\`) around code excerpts inside sentences 
- 3 backticks (\`\`\`\`\`\`\`\`) above and below code blocks 

### code styling

Use code styling for the following, which is based on the
<a href="https://developers.google.com/style/code-in-text"
rel="external">code styling list in Google’s style guide</a>:

- classes, methods and functions
- terminal commands
- fields - names and values
- data types
- filenames, extensions, paths and folders
- HTML element names
- HTTP status codes
- HTTP methods - for example GET and PUT
- placeholder variables

### Components that control other components

Use:

- primary for a component that controls other components
- secondary for a component that’s controlled by the primary component

Do not use master or slave.

### conditions

Use:

- ‘you must’ for a requirement
- ‘you should’ for a recommendation
- ‘you can’ for an option or possibility

Do not use:

- it may be possible to - use ‘you can’
- you may want to - use ‘you can’
- where possible you - use ‘where you can’

Do not use block capitals. It’s an accessibility issue, and user
research shows that it does not help users recognise and understand
requirements.

### credential issuer

Write ‘credential issuer’ the first time you refer to a credential
issuer. You can then use ‘issuer’ throughout the content.

Do not abbreviate ‘credential issuer’ to ‘CI’ or ‘CRI’.

### CSS

Do not expand the abbrevation.

### custom

We use this to mean “your own”, for example in:

- add a custom paragraph
- add custom metadata

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-5" class="govuk-accordion__section-button">D</span>

</div>

<div id="default-id-ace3fa1c-content-5"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;D&quot;,&quot;index_section&quot;:5,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### data type

Not ‘datatype’.

### data

Use the following:

- get data
- store data
- access data
- share data - not exchange data, unless data is going both ways

[Treat data as a singular
noun](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#data),
so use ‘the data is accurate’ not ‘the data are accurate’.

### Digital Marketplace

Upper case 

### disable

See turn on

### domain name

Lower case

### Domain Name System (DNS)

Upper case

### downtime 

One word, lower case. 

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-6" class="govuk-accordion__section-button">E</span>

</div>

<div id="default-id-ace3fa1c-content-6"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;E&quot;,&quot;index_section&quot;:6,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### elements

For example:

Using the correct elements in your HTML helps users of assistive
technologies navigate through your pages.

### example code

Before you give example code, describe what it does or how to use it,
for example: ‘Run the following code to…’

### enable

See turn on.

### existing technology

Be clear whether you mean the user’s existing technology, existing
third-party technology or something else.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-7" class="govuk-accordion__section-button">F</span>

</div>

<div id="default-id-ace3fa1c-content-7"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;F&quot;,&quot;index_section&quot;:7,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### filename

Not ‘file name’.

### fix

Not ‘address’.

### folder

Not ‘directory’.

### follow the guidance on

For example: follow the guidance on \[naming and registering government
websites\] (link).

### frontend

Not ‘front-end’.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-8" class="govuk-accordion__section-button">G</span>

</div>

<div id="default-id-ace3fa1c-content-8"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;G&quot;,&quot;index_section&quot;:8,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### get

Use instead of ‘receive’ for API responses, emails and so on.

### get started

Not .quickstart. or .quick start. - words like ‘quick’ can demoralise
users if they do not find the task quick.

### Git

Capital ‘G’ (as used on
<a href="https://git-scm.com/about/small-and-fast" rel="external">Git’s
own website</a>), unless it’s the `git` command within code.

### GitHub

Capital ‘G’, capital ‘H’ - as used on the
<a href="https://github.com/about" rel="external">GitHub website</a>.

### Google Chrome

Not ‘Chrome’.

### GOV.UK Design System

Upper case. 

### GOV.UK Forms

Upper case. 

### GOV.UK One Login

Upper case. 

### GOV.UK Pay

Upper case.

### GOV.UK Platform as a Service

Write out in full for first mention, then GOV.UK PaaS.

### GraphQL

One word.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-9" class="govuk-accordion__section-button">H</span>

</div>

<div id="default-id-ace3fa1c-content-9"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;H&quot;,&quot;index_section&quot;:9,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### hackers

Use ‘hackers’ instead of ‘actors’ or ‘hostile actors’.

For example, ‘Set a password that hackers cannot guess’.

### HTTPS

Upper case. Do not expand the abbreviation.

### HTTP status codes

For example, a `200` HTTP status code. Use code styling for the status
code.

### HTTP Strict Transport Security (HSTS)

Write out in full on first mention, then HSTS.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-10" class="govuk-accordion__section-button">I</span>

</div>

<div id="default-id-ace3fa1c-content-10"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;I&quot;,&quot;index_section&quot;:10,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### Identity and Access Management (IAM)

Write out in full on first mention, then IAM.

### Internet Explorer

Not ‘IE’.

### iOS

Lower case i, capital OS.

### ID

Use ‘ID’ or ‘unique ID’, not ‘identifier’. Do not expand the
abbreviation.

### information

- store information
- share information, not ‘exchange’
- get information, not ‘access’
- handle or contain information, not ‘hold’

### IP

Do not expand the abbreviation.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-11" class="govuk-accordion__section-button">J</span>

</div>

<div id="default-id-ace3fa1c-content-11"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;J&quot;,&quot;index_section&quot;:11,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### JavaScript

Capital J, capital S.

### JAWS

Not ‘Jaws’.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-12" class="govuk-accordion__section-button">L</span>

</div>

<div id="default-id-ace3fa1c-content-12"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;L&quot;,&quot;index_section&quot;:12,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### legacy

Make sure you explain what you mean by legacy.

For example: ‘Government uses a lot of older technology that’s tied into
costly contracts. These technologies are known as legacy systems.’

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-13" class="govuk-accordion__section-button">M</span>

</div>

<div id="default-id-ace3fa1c-content-13"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;M&quot;,&quot;index_section&quot;:13,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### macOS

Lower case m.

### MD5

Do not expand the abbreviation.

### meet needs

Not suit needs.

### microservices

Not micro services or micro-services.

### Mozilla Firefox

Upper case.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-14" class="govuk-accordion__section-button">N</span>

</div>

<div id="default-id-ace3fa1c-content-14"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;N&quot;,&quot;index_section&quot;:14,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### National Cyber Security Centre (NCSC)

Upper case. 

### NVDA

NonVisual Desktop Access. Expand the abbreviation on first use, and
consider linking to www.nvaccess.org/about-nvda/ or GDS documentation
that explains its use.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-15" class="govuk-accordion__section-button">O</span>

</div>

<div id="default-id-ace3fa1c-content-15"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;O&quot;,&quot;index_section&quot;:15,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### onscreen

One word. 

### Open Standards Board

Upper case.

### open standards

Lower case. For example: ‘use open standards’, or ‘follow open standards
principles’.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-16" class="govuk-accordion__section-button">P</span>

</div>

<div id="default-id-ace3fa1c-content-16"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;P&quot;,&quot;index_section&quot;:16,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### PHP

Do not expand the abbreviation.

### placeholders

Use \< CAPS_WITH_UNDERSCORES_INSIDE_ANGLE_BRACKETS \> for placeholders
in sample code, and explain the placeholder under the code sample. For
example:

\`\`\`

Authorization: \< API_KEY \>

\`\`\`

Replace `API_KEY` with the API key we sent you.

### problems

Not ‘issues’ or ‘defects’.

### Progressive web apps (PWAs)

Expand the abbrevation on first use. 

### Python

Upper case. 

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-17" class="govuk-accordion__section-button">R</span>

</div>

<div id="default-id-ace3fa1c-content-17"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;R&quot;,&quot;index_section&quot;:17,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### render

Use for HTML. 

For example: ‘If the CSS or JavaScript fails, your user’s browser still
renders the HTML correctly.’

### REST

Upper case. Do not expand the acronym if you’re writing for API
developers.

Use ‘a REST API’ instead of ‘a RESTful API’. If you need to, include
RESTful in brackets after the first use of REST. For example: ‘Our API
follows REST principles (it’s ‘RESTful’)’.

### Ruby

Upper case. 

### Ruby on Rails

If you say Ruby on Rails (‘Rails’) the first time, you can use just
‘Rails’ afterwards.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-18" class="govuk-accordion__section-button">S</span>

</div>

<div id="default-id-ace3fa1c-content-18"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;S&quot;,&quot;index_section&quot;:18,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### screen reader

Not ‘screenreader’.

### service

Avoid ‘online service’ unless you’re distinguishing it from other kinds
of service.

### set up

Not ‘instantiate’, ‘spin up’ or ‘stand up’.

For example: ‘Set up a server by…’

### smoke test

Lower case. 

### SOAP

Do not expand the acronym if you’re writing for API development teams.

### SQL

Do not expand the acronym.

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-19" class="govuk-accordion__section-button">T</span>

</div>

<div id="default-id-ace3fa1c-content-19"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;T&quot;,&quot;index_section&quot;:19,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### (a) terminal

Not ‘the command-line’ or ‘the command-line interface’, or ‘Terminal’
(which is the macOS terminal specifically).

### test

Ask users to ‘run’ a test, not ‘conduct’, ‘execute’ or ‘perform’.

### test environment

Not ‘prototype environment’ - user research shows this causes confusion.

### third parties

For conciseness use only ‘a third party’ instead of ‘a third-party
organisation’.

### Technology Code of Practice (TCoP)

Upper case. Write out in full for first mention, then use TCoP.

### turn on

Use:

- ‘turn on’, not ‘enable’
- ‘turn off’, not ‘disable’, ‘mute’ or ‘silence’

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-20" class="govuk-accordion__section-button">U</span>

</div>

<div id="default-id-ace3fa1c-content-20"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;U&quot;,&quot;index_section&quot;:20,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### uptime

One word, lower case. 

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-21" class="govuk-accordion__section-button">V</span>

</div>

<div id="default-id-ace3fa1c-content-21"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;V&quot;,&quot;index_section&quot;:21,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### verifiable credential (VC)

Lower case. 

### version

To avoid ambiguity, use:

- the latest version
- the latest stable version
- the previous version
- an earlier version
- a later version

### VoiceOver

One word. 

</div>

</div>

</div>

<div class="govuk-accordion__section">

<div class="govuk-accordion__section-header">

## <span id="default-id-ace3fa1c-heading-22" class="govuk-accordion__section-button">W</span>

</div>

<div id="default-id-ace3fa1c-content-22"
class="govuk-accordion__section-content" module="ga4-link-tracker"
ga4-set-indexes=""
ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;accordion&quot;,&quot;section&quot;:&quot;W&quot;,&quot;index_section&quot;:22,&quot;index_section_count&quot;:22}">

<div class="gem-c-govspeak govuk-govspeak govuk-!-margin-bottom-0"
module="govspeak">

### Web Content Accessibility Guidelines (WCAG)

Use the full name the first time on a page. Where you need to, specify
the version, for example: “Public sector websites and applications must
meet the Web Content Accessibility Guidelines (WCAG) version 2.1 AA
standard”.

### Words to avoid

- action as a verb - use ‘do’
- action as a noun - use ‘task’
- allow - use ‘let’
- assets - use ‘files’ or ‘documents’
- consult - use ‘check’
- detail (as a verb) - use ‘explain’ or ‘tell’
- easy or easily  - this can demoralise users if they do not find it
  easy
- enable - use ‘help’
- ensure - use ‘make sure’
- examine - use ‘check’, ‘assess’ or ‘review’
- fulfil - use ‘meet’
- in order to - use ‘so you can’
- inform - use ‘show’ or ‘tell’
- interrogate - use ‘monitor’ or ‘track’
- periodically - try to be specific
- quick - this can demoralise users if they do not find it quick
- refer to - use ‘Read more about \[xxx\]’ for an internal link or ‘You
  can find out how to \[xxx\] on the yyy website’ for an external link
- regularly - try to be specific
- requires - use ‘needs’
- should the - use ‘if the’
- simple - this can demoralise users if they do not find it simple
- take place - use ‘happen’, or use active voice to start with the verb
- underlying - this can usually be removed without losing the sentence’s
  meaning

</div>

</div>

</div>

</div>

</div>

</div>

<div class="gem-c-print-link govuk-!-display-none-print govuk-!-margin-bottom-3">

Print this page

</div>

</div>

</div>
