/**
 * Creates a virtual element with properties and event listeners.
 */
let create = (tag, properties = {}, events = {}) => {
    let virtual = document.createElement(tag);

    Object.keys(properties).forEach((key) => {
        if (key.indexOf('dataset') !== -1) {
            virtual.dataset[key.split('_')[1]] = properties[key];

            return false;
        }

        virtual[key] = properties[key];
    });

    Object.keys(events).forEach((key) => {
        virtual[key] = events[key].apply(virtual);
    });

    return virtual;
}

/**
 * Minimal jQuery-like custom class.
 */
class Element {
    constructor(node) {
        this.node = node || document;

        return this;
    }

    find(selector, hasWarning = true) {
        const found = this.node.querySelector(selector);

        if (!found) {
            if (hasWarning) {
                console.warn('Failed to find: ' + selector);
            }

            return false;
        }

        return new Element(found);
    }

    findId(id, hasWarning = false) {
        return this.find('#' + id);
    }

    findAll(selector) {
        const els = this.node.querySelectorAll(selector);
        let list = [],
            i;

        for (i = 0; i < els.length; i++) {
            list.push(new Element(els[i]));
        }

        return list;
    }

    data() {
        return this.node.dataset;
    }

    html(content = false) {
        if (!content) {
            return this.node.innerHTML;
        }

        this.node.innerHTML = content.trim();

        return this;
    }

    htmlSelf() {
        return this.node.outerHTML.trim();
    }

    css(property, value) {
        this.node.style[property] = value;

        return this;
    }

    show() {
        this.removeClass('hidden');

        return this;
    }

    hide() {
        this.addClass('hidden');

        return this;
    }

    hasClass(class_) {
        return this.classes().contains(class_);
    }

    addClass(class_) {
        if (!this.hasClass(class_)) {
            this.classes().add(class_);
        }

        return this;
    }

    removeClass(class_) {
        if (this.hasClass(class_)) {
            this.classes().remove(class_);
        }

        return this;
    }

    classes() {
        return this.node.classList;
    }

    classesStr() {
        return this.classes().toString();
    }

    toggleClasses(first, second) {
        let temp;

        if (this.hasClass(first)) {
            temp = first;
            first = second;
            second = temp;
        }

        this.addClass(first);
        this.removeClass(second);

        return this;
    }

    attr(name, value = false) {
        if (!value) {
            return this.node.getAttribute(name);
        }

        return this.node.setAttribute(name, value);
    }

    replace(content) {
        let virtual = document.createElement('div');

        virtual.innerHTML = content.trim();

        this.parent().node.replaceChild(virtual.firstChild, this.node);

        return this;
    }

    remove() {
        this.parent().node.removeChild(this.node);

        return this;
    }

    parent() {
        return new Element(this.node.parentNode);
    }

    style(key, value) {
        this.node.style[key] = value;

        return this;
    }

    addChild(tag, properties, events) {
        let virtual = create(tag, properties, events);

        this.node.appendChild(virtual);

        return new Element(virtual);
    }

    addBefore(tag, properties = {}) {
        let virtual = create(tag, properties);

        this.parent().node.insertBefore(virtual, this.node.nextSibling);

        return new Element(virtual);
    }

    select() {
        this.node.select();

        return this;
    }

    bounds() {
        return this.node.getBoundingClientRect();
    }

    offsetLeft() {
        return this.node.offsetLeft;
    }

    offsetRight() {
        return this.node.offsetRight;
    }

    size() {
        return {
            width: this.node.offsetWidth,
            height: this.node.offsetHeight
        };
    }

    setSizes(size = {}) {
        Object.keys(size).forEach((key) => {
            this.style(key, `${size[key]}px`);
        });
    }

    onScreen() {
        const bounds = this.bounds(),
            halfHight = (bounds.height || 360) / 2,
            topAbs = Math.abs(bounds.top),
            diffAbs = window.innerHeight - topAbs,
            inView = bounds.top < window.innerHeight && bounds.bottom > 0,
            fiftyPercent = diffAbs >= halfHight,
            mustPause = (bounds.top < 0 && topAbs >= halfHight) || (diffAbs <= halfHight) || false,
            mustPlay = inView && fiftyPercent && !mustPause;

        return {
            mustPlay,
            mustPause
        };
    }

    sub(evName, callback) {
        this.node.addEventListener(evName, (ev) => {
            callback.call(this, ev, this)
        });
    }

    pub(evName, data = {}) {
        const event = new CustomEvent(evName, { detail: data });

        this.node.dispatchEvent(event);
    }

    slideUp() {
        this.addClass('slide');

        return this;
    }

    slideDown() {
        this.removeClass('slide');

        return this;
    }

    asFaded() {
        this.addClass('fade');
        this.addClass('faded');

        return this;
    }

    fadeOut() {
        this.addClass('faded');

        return this;
    }

    fadeIn() {
        this.removeClass('faded');

        return this;
    }
}

export default (node) => new Element(node);
