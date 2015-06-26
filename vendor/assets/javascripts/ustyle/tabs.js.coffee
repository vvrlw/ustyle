{setOptions} = @Utils

createContext = (options) ->
  class Tabs
    defaults:
      tabContainer: ".us-tabs"
      tabLinks: ".us-tabs-nav-mainlink"
      tabTitle: "us-tab-title"
      changeUrls: true
      activeClass: "active"

    constructor: (options) ->
      {@tabContainer, @tabLinks} = @options = setOptions options, @defaults
      @tabs = $(@tabContainer)
      @tab = @tabs.find(@tabLinks)
      @filter = if @tab.data "target" then "data-target" else "href"
      @hash = window.location.hash

      @init()

      $(@tabLinks).on "click.ustyle.tab", (e) =>
        target = $(e.currentTarget)
        @navigateTo(target)
        @hashChange(target)
        e.preventDefault()

    init: ->
      $first =
        if @tab.hasClass(@options.activeClass)
          @tab.filter(".#{@options.activeClass}")
        else @tab.first()
      $initialHash = @tab.filter("[#{@filter}='#{@hash.replace("!", "")}']")

      if $initialHash.length
        @navigateTo($initialHash)
      else
        @navigateTo($first)

    hashChange: (selector) ->
      return unless @options.changeUrls
      location.replace "#!#{getSelector(selector).replace(/#/, "")}"

    navigateTo: (activeSelector) ->
      selector = getSelector(activeSelector)
      $selected = $(selector)

      @tab.removeClass(@options.activeClass).end()
      @tab.filter("[#{@filter}='#{selector}']").addClass(@options.activeClass)

      $selected
        .siblings(".#{@options.activeClass}")
        .removeClass(@options.activeClass).end()
        .addClass(@options.activeClass)

      if activeSelector.parent().hasClass(@options.tabTitle)
        scrollToTab($selected)

      $selected.trigger("ustyle.tab.active")

    getSelector = (clicked) ->
      return clicked.data("target") or clicked.attr("href")

    scrollToTab = (activeTab) ->
      $("html,body").scrollTop(activeTab.offset().top)

    Tabs

window.Tabs = createContext()