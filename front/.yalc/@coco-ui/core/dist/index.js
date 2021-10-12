'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var injectClassNames = function (as) {
    if (as === void 0) { as = 'div'; }
    return function (strings) {
        var Element = function (_a) {
            var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
            return React__default['default'].createElement(as, __assign({ className: "" + (className !== null && className !== void 0 ? className : '') + (strings ? " " + strings : "") }, props), children);
        };
        Element.displayName = "" + as;
        return Element;
    };
};

var sizes$4 = {
    xs: 'text-xs p-1',
    sm: 'text-sm p-1',
    md: 'p-1',
    xl: 'text-xl p-1',
    '2xl': 'text-2xl p-1',
};
var variants$6 = {
    primary: 'bg-primary-600 text-background hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-background focus:outline-none focus:ring-2 focus:ring-primary-300',
    'no-border': "text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300",
};
var StyledButton = injectClassNames('button')(templateObject_1$4 || (templateObject_1$4 = __makeTemplateObject(["flex rounded items-center justify-center"], ["flex rounded items-center justify-center"])));
var StyledButtonContent = injectClassNames('div')(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["shadow z-10 bg-background absolute left-0 min-w-full w-max mt-1"], ["shadow z-10 bg-background absolute left-0 min-w-full w-max mt-1"])));
var ActionButton = function (_a) {
    var _b;
    var children = _a.children, className = _a.className, _c = _a.variant, variant = _c === void 0 ? 'primary' : _c, size = _a.size, props = __rest(_a, ["children", "className", "variant", "size"]);
    var _d = React__default['default'].useState(false), showActions = _d[0], setShowActions = _d[1];
    var listRef = React__default['default'].useRef(null);
    var content = [];
    var actions = [];
    var handleActionClick = function (childOnClick) { return function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, childOnClick(event)];
                case 1:
                    _a.sent();
                    setShowActions(false);
                    return [2 /*return*/];
            }
        });
    }); }; };
    React__default['default'].useEffect(function () {
        var clickHandler = function (event) {
            if ((listRef === null || listRef === void 0 ? void 0 : listRef.current) && listRef.current.contains(event.target)) {
                event.stopPropagation();
            }
            else {
                setShowActions(false);
            }
        };
        document.addEventListener('click', clickHandler);
        return function () {
            document.removeEventListener('click', clickHandler);
        };
    }, []);
    React__default['default'].Children.forEach(children, function (child, index) {
        if (!React__default['default'].isValidElement(child)) {
            return child;
        }
        var elementChild = child;
        if (elementChild.type === ActionButton.Action) {
            actions.push(React__default['default'].cloneElement(child, {
                key: child.key || index,
                onClick: child.props.onClick
                    ? handleActionClick(child.props.onClick)
                    : function () {
                        setShowActions(false);
                    },
            }));
        }
        else {
            content.push(child);
        }
    });
    return (React__default['default'].createElement("div", { ref: listRef, className: "relative" },
        React__default['default'].createElement(StyledButton, __assign({ onClick: function () { return setShowActions(!showActions); }, className: ((className !== null && className !== void 0 ? className : '') + " " + variants$6[variant] + " " + (size ? (_b = sizes$4[size]) !== null && _b !== void 0 ? _b : '' : '')).trim() }, props), content),
        React__default['default'].createElement(StyledButtonContent, { className: showActions ? 'block' : 'sr-only' }, actions)));
};
ActionButton.defaultProps = {
    variant: 'primary',
};
var Action = function (props) {
    return (React__default['default'].createElement("div", { className: "p-2 hover:bg-primary-100 cursor-pointer", onClick: props.onClick }, props.children));
};
Action.displayName = 'ActionButton.Action';
var Content = function (props) {
    return React__default['default'].createElement(React__default['default'].Fragment, null, props.children);
};
Content.displayName = 'ActionButton.Content';
ActionButton.Content = Content;
ActionButton.Action = Action;
var templateObject_1$4, templateObject_2$1;

var getStringFromAlt = function (altStr) {
    if (!altStr)
        return '';
    var array = altStr.split(' ');
    if (array.length > 1) {
        return ("" + (array[0].substr(0, 1) + array[1].substr(0, 1))).toUpperCase();
    }
    return array.length ? ("" + array[0].substr(0, 1)).toUpperCase() : '';
};
var StyledImg = injectClassNames('img')(templateObject_1$3 || (templateObject_1$3 = __makeTemplateObject(["rounded-full bg-gray-300 flex justify-center items-center"], ["rounded-full bg-gray-300 flex justify-center items-center"])));
var StyledDiv = injectClassNames('div')(templateObject_2 || (templateObject_2 = __makeTemplateObject(["rounded-full bg-gray-300 flex justify-center items-center p-4"], ["rounded-full bg-gray-300 flex justify-center items-center p-4"])));
var Avatar = function (_a) {
    var size = _a.size, src = _a.src, alt = _a.alt, className = _a.className, props = __rest(_a, ["size", "src", "alt", "className"]);
    return src ? (React__default['default'].createElement(StyledImg, __assign({ src: src, alt: alt, className: className, style: { width: size, height: size } }, props))) : (React__default['default'].createElement(StyledDiv, __assign({ className: className, style: { width: size, height: size } }, props), getStringFromAlt(alt)));
};
Avatar.defaultProps = {
    size: 24,
};
var templateObject_1$3, templateObject_2;

var variants$5 = {
    basic: "bg-primary-600 text-white",
    outline: "border border-primary-600 text-primary-600",
    'no-border': "text-primary-600",
};
var StyledBadge = injectClassNames('div')(templateObject_1$2 || (templateObject_1$2 = __makeTemplateObject(["flex rounded items-center justify-center"], ["flex rounded items-center justify-center"])));
var Badge = function (_a) {
    var variant = _a.variant, children = _a.children, className = _a.className, props = __rest(_a, ["variant", "children", "className"]);
    return (React__default['default'].createElement(StyledBadge, __assign({ className: variants$5[variant] + " " + className }, props), children));
};
Badge.defaultProps = {
    className: 'px-2 py-1',
    color: 'primary',
    variant: 'basic',
};
var templateObject_1$2;

var StyledBox = injectClassNames('div')(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["shadow dark:shadow-dark rounded text-foreground dark:text-background"], ["shadow dark:shadow-dark rounded text-foreground dark:text-background"])));
var Box = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return (React__default['default'].createElement(StyledBox, __assign({ className: className }, props), children));
};
Box.defaultProps = {
    className: 'p-2',
};
var templateObject_1$1;

var icons = {
    'academic-cap': 'AcademicCap',
    adjustments: 'Adjustments',
    annotation: 'Annotation',
    archive: 'Archive',
    'arrow-circle-down': 'ArrowCircleDown',
    'arrow-circle-left': 'ArrowCircleLeft',
    'arrow-circle-right': 'ArrowCircleRight',
    'arrow-circle-up': 'ArrowCircleUp',
    'arrow-up': 'ArrowUp',
    'arrow-right': 'ArrowRight',
    'arrow-down': 'ArrowDown',
    'arrow-left': 'ArrowLeft',
    'arrows-expand': 'ArrowsExpand',
    'at-symbol': 'AtSymbol',
    backspace: 'Backspace',
    'badge-check': 'BadgeCheck',
    ban: 'Ban',
    beaker: 'Beaker',
    bell: 'Bell',
    'book-open': 'BookOpen',
    'bookmark-alt': 'BookmarkAlt',
    bookmark: 'Bookmark',
    briefcase: 'Briefcase',
    calculator: 'Calculator',
    calendar: 'Calendar',
    camera: 'Camera',
    cash: 'Cash',
    'chart-bar': 'ChartBar',
    'chart-pie': 'ChartPie',
    'chart-square-bar': 'ChartSquareBar',
    'chat-alt-2': 'ChatAlt2',
    'chat-alt': 'ChatAlt',
    chat: 'Chat',
    'check-circle': 'CheckCircle',
    check: 'Check',
    'chevron-double-down': 'ChevronDoubleDown',
    'chevron-double-left': 'ChevronDoubleLeft',
    'chevron-double-right': 'ChevronDoubleRight',
    'chevron-double-up': 'ChevronDoubleUp',
    'chevron-down': 'ChevronDown',
    'chevron-left': 'ChevronLeft',
    'chevron-right': 'ChevronRight',
    'chevron-up': 'ChevronUp',
    chip: 'Chip',
    'clipboard-check': 'ClipboardCheck',
    'clipboard-copy': 'ClipboardCopy',
    'clipboard-list': 'ClipboardList',
    clipboard: 'Clipboard',
    clock: 'Clock',
    'cloud-download': 'CloudDownload',
    'cloud-upload': 'CloudUpload',
    cloud: 'Cloud',
    code: 'Code',
    cog: 'Cog',
    collection: 'Collection',
    'color-swatch': 'ColorSwatch',
    'credit-card': 'CreditCard',
    'cube-transparent': 'CubeTransparent',
    cube: 'Cube',
    'currency-bangladeshi': 'CurrencyBangladeshi',
    'currency-dollar': 'CurrencyDollar',
    'currency-euro': 'CurrencyEuro',
    'currency-pound': 'CurrencyPound',
    'currency-rupee': 'CurrencyRupee',
    'currency-yen': 'CurrencyYen',
    'cursor-click': 'CursorClick',
    database: 'Database',
    'desktop-computer': 'DesktopComputer',
    'device-mobile': 'DeviceMobile',
    'device-tablet': 'DeviceTablet',
    'document-add': 'DocumentAdd',
    'document-download': 'DocumentDownload',
    'document-duplicate': 'DocumentDuplicate',
    'document-remove': 'DocumentRemove',
    'document-report': 'DocumentReport',
    'document-search': 'DocumentSearch',
    'document-text': 'DocumentText',
    document: 'Document',
    'dots-circle-horizontal': 'DotsCircleHorizontal',
    'dots-horizontal': 'DotsHorizontal',
    'dots-vertical': 'DotsVertical',
    download: 'Download',
    duplicate: 'Duplicate',
    'emoji-happy': 'EmojiHappy',
    'emoji-sad': 'EmojiSad',
    'exclamation-circle': 'ExclamationCircle',
    exclamation: 'Exclamation',
    'external-link': 'ExternalLink',
    'eye-off': 'EyeOff',
    eye: 'Eye',
    'fast-forward': 'FastForward',
    film: 'Film',
    filter: 'Filter',
    'finger-print': 'FingerPrint',
    fire: 'Fire',
    flag: 'Flag',
    'folder-add': 'FolderAdd',
    'folder-download': 'FolderDownload',
    'folder-open': 'FolderOpen',
    'folder-remove': 'FolderRemove',
    folder: 'Folder',
    gift: 'Gift',
    'globe-alt': 'GlobeAlt',
    globe: 'Globe',
    hand: 'Hand',
    hashtag: 'Hashtag',
    heart: 'Heart',
    home: 'Home',
    identification: 'Identification',
    'inbox-in': 'InboxIn',
    inbox: 'Inbox',
    'information-circle': 'InformationCircle',
    key: 'Key',
    library: 'Library',
    'light-bulb': 'LightBulb',
    'lightning-bolt': 'LightningBolt',
    link: 'Link',
    'location-marker': 'LocationMarker',
    'lock-closed': 'LockClosed',
    'lock-open': 'LockOpen',
    login: 'Login',
    logout: 'Logout',
    'mail-open': 'MailOpen',
    mail: 'Mail',
    map: 'Map',
    'menu-alt-1': 'MenuAlt1',
    'menu-alt-2': 'MenuAlt2',
    'menu-alt-3': 'MenuAlt3',
    'menu-alt-4': 'MenuAlt4',
    menu: 'Menu',
    microphone: 'Microphone',
    'minus-circle': 'MinusCircle',
    'minus-sm': 'MinusSm',
    minus: 'Minus',
    moon: 'Moon',
    'office-building': 'OfficeBuilding',
    'paper-airplane': 'PaperAirplane',
    'paper-clip': 'PaperClip',
    pause: 'Pause',
    'pencil-alt': 'PencilAlt',
    pencil: 'Pencil',
    'phone-incoming': 'PhoneIncoming',
    'phone-missed-call': 'PhoneMissedCall',
    'phone-outgoing': 'PhoneOutgoing',
    phone: 'Phone',
    photograph: 'Photograph',
    play: 'Play',
    'plus-circle': 'PlusCircle',
    'plus-sm': 'PlusSm',
    plus: 'Plus',
    'presentation-chart-bar': 'PresentationChartBar',
    'presentation-chart-line': 'PresentationChartLine',
    printer: 'Printer',
    puzzle: 'Puzzle',
    qrcode: 'Qrcode',
    'question-mark-circle': 'QuestionMarkCircle',
    'receipt-refund': 'ReceiptRefund',
    'receipt-tax': 'ReceiptTax',
    refresh: 'Refresh',
    reply: 'Reply',
    rewind: 'Rewind',
    rss: 'Rss',
    'save-as': 'SaveAs',
    save: 'Save',
    scale: 'Scale',
    scissors: 'Scissors',
    'search-circle': 'SearchCircle',
    search: 'Search',
    selector: 'Selector',
    server: 'Server',
    share: 'Share',
    'shield-check': 'ShieldCheck',
    'shield-exclamation': 'ShieldExclamation',
    'shopping-bag': 'ShoppingBag',
    'shopping-cart': 'ShoppingCart',
    'sort-ascending': 'SortAscending',
    'sort-descending': 'SortDescending',
    sparkles: 'Sparkles',
    speakerphone: 'Speakerphone',
    star: 'Star',
    'status-offline': 'StatusOffline',
    'status-online': 'StatusOnline',
    stop: 'Stop',
    sun: 'Sun',
    support: 'Support',
    'switch-horizontal': 'SwitchHorizontal',
    'switch-vertical': 'SwitchVertical',
    table: 'Table',
    tag: 'Tag',
    template: 'Template',
    terminal: 'Terminal',
    'thumb-down': 'ThumbDown',
    'thumb-up': 'ThumbUp',
    ticket: 'Ticket',
    translate: 'Translate',
    trash: 'Trash',
    'trending-down': 'TrendingDown',
    'trending-up': 'TrendingUp',
    truck: 'Truck',
    upload: 'Upload',
    'user-add': 'UserAdd',
    'user-circle': 'UserCircle',
    'user-group': 'UserGroup',
    'user-remove': 'UserRemove',
    user: 'User',
    users: 'Users',
    variable: 'Variable',
    'video-camera': 'VideoCamera',
    'view-boards': 'ViewBoards',
    'view-grid-add': 'ViewGridAdd',
    'view-grid': 'ViewGrid',
    'view-list': 'ViewList',
    'volume-off': 'VolumeOff',
    'volume-up': 'VolumeUp',
    wifi: 'Wifi',
    'x-circle': 'XCircle',
    x: 'X',
    'zoom-in': 'ZoomIn',
    'zoom-out': 'ZoomOut',
};
var Icon = function (_a) {
    var name = _a.name, _b = _a.type, type = _b === void 0 ? 'solid' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.size, size = _d === void 0 ? 24 : _d, _e = _a.fallback, fallback = _e === void 0 ? undefined : _e, onClick = _a.onClick;
    if (!name) {
        throw new Error("Can't call Icon component without name props");
    }
    var Icon = React__default['default'].useMemo(function () {
        return React__default['default'].lazy(function () { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require("@heroicons/react/" + type + "/" + icons[name] + "Icon")); }); });
    }, [type, name, icons]);
    return (React__default['default'].createElement(React__default['default'].Suspense, { fallback: fallback !== null && fallback !== void 0 ? fallback : (React__default['default'].createElement("div", { className: "" + (className !== null && className !== void 0 ? className : ''), style: { height: size, width: size, display: 'inline' } })) },
        React__default['default'].createElement(Icon, { onClick: onClick, height: size, width: size, className: "" + className })));
};
Icon.defaultProps = {
    type: 'solid',
    size: 24,
    fallback: undefined,
};

var variants$4 = {
    primary: "btn-primary",
    default: "btn-default",
    success: "btn-success",
    error: "btn-error",
    warning: "btn-warning",
    info: "btn-info",
    transparent: "btn-transparent",
    link: "btn-link",
    'inverted-primary': "btn-primary-outline",
    'inverted-default': "btn-default-outline",
    'inverted-success': "btn-success-outline",
    'inverted-error': "btn-error-outline",
    'inverted-warning': "btn-warning-outline",
    'inverted-info': "btn-info-outline",
};
var sizes$3 = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
    '2xl': 'btn-2xl',
};
var Button = function (_a) {
    var children = _a.children, tabIndex = _a.tabIndex, className = _a.className, variant = _a.variant, size = _a.size, icon = _a.icon, iconPosition = _a.iconPosition, iconSize = _a.iconSize, props = __rest(_a, ["children", "tabIndex", "className", "variant", "size", "icon", "iconPosition", "iconSize"]);
    return (React__default['default'].createElement("button", __assign({ tabIndex: tabIndex, className: [
            variants$4[variant],
            size ? sizes$3[size] : '',
            className !== null && className !== void 0 ? className : '',
        ].join(' ') }, props), icon ? (React__default['default'].createElement(React__default['default'].Fragment, null,
        iconPosition !== 'right' && (React__default['default'].createElement(Icon, { className: "mr-1", name: icon, size: iconSize })),
        children,
        iconPosition === 'right' && (React__default['default'].createElement(Icon, { className: "ml-1", name: icon, size: iconSize })))) : (children)));
};
Button.defaultProps = {
    variant: 'primary',
    tabIndex: -1,
    iconPosition: 'left',
};

function CheckIcon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
    clipRule: "evenodd"
  }));
}

function ChevronDownIcon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
    clipRule: "evenodd"
  }));
}

function XIcon$1(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
    clipRule: "evenodd"
  }));
}

var variants$3 = {
    basic: {
        label: function (checked) {
            return "flex items-center justify-center appearance-none w-4 h-4 rounded relative " + (checked ? 'bg-primary-500' : 'border border-gray-300');
        },
        check: function (checked) {
            return "" + (checked ? 'fill-current text-background' : 'hidden');
        },
    },
};
var Checkbox = React__default['default'].forwardRef(function (_a, ref) {
    var _b, _c, _d, _e;
    var id = _a.id, label = _a.label, _f = _a.labelPosition, labelPosition = _f === void 0 ? 'right' : _f, name = _a.name, ariaChecked = _a["aria-checked"], ariaLabel = _a["aria-label"], ariaLabelledBy = _a["aria-labelledby"], value = _a.value, checked = _a.checked, defaultChecked = _a.defaultChecked, onChange = _a.onChange, _g = _a.variant, variant = _g === void 0 ? 'basic' : _g;
    var inputRef = React__default['default'].useRef(null);
    React__default['default'].useImperativeHandle(ref, function () { return inputRef.current; });
    return !label ? (React__default['default'].createElement("label", { "aria-checked": ariaChecked || checked, className: "" + ((_b = variants$3[variant]) === null || _b === void 0 ? void 0 : _b.label(!!checked)) },
        React__default['default'].createElement(CheckIcon, { className: (_c = variants$3[variant]) === null || _c === void 0 ? void 0 : _c.check(!!checked) }),
        React__default['default'].createElement("input", { id: id, className: "appearance-none", ref: inputRef, type: "checkbox", name: name, checked: checked, defaultChecked: defaultChecked, value: value, "aria-label": ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : name + "-checkbox", onChange: onChange }))) : (React__default['default'].createElement("label", { className: "flex items-center", "aria-checked": ariaChecked || checked },
        labelPosition === 'left' && React__default['default'].createElement("span", { className: "mr-1" }, label),
        React__default['default'].createElement("div", { className: (_d = variants$3[variant]) === null || _d === void 0 ? void 0 : _d.label(!!checked) },
            React__default['default'].createElement(CheckIcon, { className: (_e = variants$3[variant]) === null || _e === void 0 ? void 0 : _e.check(!!checked) }),
            React__default['default'].createElement("input", { id: id, className: "appearance-none", ref: inputRef, type: "checkbox", name: name, checked: checked, defaultChecked: defaultChecked, value: value, "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, onChange: onChange })),
        labelPosition === 'right' && React__default['default'].createElement("span", { className: "ml-1" }, label)));
});
Checkbox.displayName = 'Checkbox';

var positions = {
    top: {
        container: '-top-80 left-0 w-full h-64',
        closeButton: "absolute -bottom-10 right-2",
    },
    right: {
        container: '-right-80 top-0 w-64 h-full',
        closeButton: "absolute top-2 -left-10",
    },
    bottom: {
        container: '-bottom-80 left-0 w-full h-64',
        closeButton: "absolute right-2 -top-10",
    },
    left: {
        container: '-left-80 top-0 w-64 h-full',
        closeButton: "absolute top-2 -right-10",
    },
};
var animations$2 = {
    slide: function (open, position) {
        if (open === void 0) { open = false; }
        if (position === void 0) { position = 'left'; }
        switch (position) {
            case 'top':
                return "transition-transform duration-300 transform " + (open ? 'translate-y-80' : '-translate-y-80');
            case 'right':
                return "transition-transform duration-300 transform " + (open ? '-translate-x-80' : 'translate-x-80');
            case 'bottom':
                return "transition-transform duration-300 transform " + (open ? '-translate-y-80' : 'translate-y-80');
            case 'left':
                return "transition-transform duration-300 transform " + (open ? 'translate-x-80' : '-translate-x-80');
        }
    },
};
var Drawer = function (_a) {
    var _b, _c, _d, _e;
    var children = _a.children, open = _a.open, hasBackdrop = _a.hasBackdrop, hasCloseButton = _a.hasCloseButton, position = _a.position, onClose = _a.onClose;
    var _f = React__default['default'].useState(open), isVisible = _f[0], setIsVisible = _f[1];
    React__default['default'].useEffect(function () {
        var handler = setTimeout(function () {
            setIsVisible(open);
        }, open ? 0 : 500);
        return function () { return clearTimeout(handler); };
    }, [open]);
    return hasBackdrop ? (React__default['default'].createElement("div", { onDoubleClick: onClose, className: isVisible
            ? "z-10 fixed left-0 top-0 bg-opacity-20 bg-foreground w-full h-full"
            : "sr-only" },
        React__default['default'].createElement("div", { onDoubleClick: function (e) { return e.stopPropagation(); }, className: "bg-background fixed " + ((_b = positions[position]) === null || _b === void 0 ? void 0 : _b.container) + " p-2 shadow " + animations$2.slide(open, position) }, isVisible ? (React__default['default'].createElement(React__default['default'].Fragment, null,
            hasCloseButton && (React__default['default'].createElement(XIcon$1, { className: ((_c = positions[position]) === null || _c === void 0 ? void 0 : _c.closeButton) + " stroke-current fill-current text-foreground stroke-0 p-2 w-8 h-8 bg-background shadow-xl overflow-hidden rounded-full", onClick: onClose, role: "button" })),
            children)) : null))) : (React__default['default'].createElement("div", { className: "z-10 bg-background fixed " + ((_d = positions[position]) === null || _d === void 0 ? void 0 : _d.container) + " p-2 shadow " + animations$2.slide(open, position) }, isVisible ? (React__default['default'].createElement(React__default['default'].Fragment, null,
        hasCloseButton && (React__default['default'].createElement(XIcon$1, { className: ((_e = positions[position]) === null || _e === void 0 ? void 0 : _e.closeButton) + " stroke-current fill-current text-foreground stroke-0 p-2 w-8 h-8 bg-background shadow-xl overflow-hidden rounded-full", onClick: onClose, role: "button" })),
        children)) : null));
};
Drawer.defaultProps = {
    open: false,
    position: 'right',
    hasBackdrop: false,
    hasCloseButton: true,
};

var GridItem = function (_a) {
    var children = _a.children, colSpan = _a.colSpan, rowSpan = _a.rowSpan, colStart = _a.colStart, rowStart = _a.rowStart, colEnd = _a.colEnd, rowEnd = _a.rowEnd, className = _a.className, props = __rest(_a, ["children", "colSpan", "rowSpan", "colStart", "rowStart", "colEnd", "rowEnd", "className"]);
    var itemClassNames = '';
    if (colSpan) {
        itemClassNames += " col-span-" + colSpan;
    }
    if (rowSpan) {
        itemClassNames += " row-span-" + rowSpan;
    }
    if (colStart) {
        itemClassNames += " col-start-" + colStart;
    }
    if (rowStart) {
        itemClassNames += " row-start-" + rowStart;
    }
    if (colEnd) {
        itemClassNames += " col-end-" + colEnd;
    }
    if (rowEnd) {
        itemClassNames += " row-end-" + rowEnd;
    }
    return (React__default['default'].createElement("div", __assign({ className: (itemClassNames + " " + (className !== null && className !== void 0 ? className : '')).trim() }, props), children));
};

var Grid = function (_a) {
    var cols = _a.cols, rows = _a.rows, gap = _a.gap, flow = _a.flow, autoCols = _a.autoCols, autoRows = _a.autoRows, children = _a.children, className = _a.className, props = __rest(_a, ["cols", "rows", "gap", "flow", "autoCols", "autoRows", "children", "className"]);
    var gridClassNames = 'grid';
    if (autoRows) {
        gridClassNames += " auto-rows-" + autoRows;
    }
    if (autoCols) {
        gridClassNames += " auto-cols-" + autoCols;
    }
    if (flow) {
        gridClassNames += " grid-flow-" + flow;
    }
    if (cols) {
        gridClassNames += " grid-cols-" + cols;
    }
    if (rows) {
        gridClassNames += " grid-rows-" + rows;
    }
    if (gap) {
        gridClassNames += " gap-" + gap;
    }
    return (React__default['default'].createElement("div", __assign({ className: (gridClassNames + " " + className).trim() }, props), children));
};
Grid.Item = GridItem;

var Link = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (React__default['default'].createElement("button", __assign({ role: "link", className: 'text-primary-600 font-bold underline ' + className }, props), children));
};
Link.defaultProps = {
    className: '',
};

var ListRowCard = function (_a) {
    var className = _a.className, children = _a.children, innerRef = _a.innerRef, props = __rest(_a, ["className", "children", "innerRef"]);
    useListContext().columns;
    return (React__default['default'].createElement("div", __assign({ className: ["list-row-card", className !== null && className !== void 0 ? className : ''].join(' '), ref: innerRef }, props), children));
};
var DefaultListRow = function (_a) {
    var className = _a.className, children = _a.children, innerRef = _a.innerRef, props = __rest(_a, ["className", "children", "innerRef"]);
    useListContext().columns;
    return (React__default['default'].createElement("div", __assign({ className: ["list-row", className !== null && className !== void 0 ? className : ''].join(' '), ref: innerRef }, props), children));
};
var ListRow = React.forwardRef(function (props, ref) {
    var variant = useListContext().variant;
    var innerRef = React__default['default'].useRef(null);
    React__default['default'].useImperativeHandle(ref, function () { return innerRef.current; });
    var Component = React__default['default'].useMemo(function () {
        var _a;
        return variant
            ? (_a = {
                card: ListRowCard,
            }[variant]) !== null && _a !== void 0 ? _a : DefaultListRow
            : DefaultListRow;
    }, [variant]);
    return React__default['default'].createElement(Component, __assign(__assign({}, props), { innerRef: innerRef }));
});
ListRow.displayName = 'ListRow';

var ListCell = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React__default['default'].createElement("div", __assign({ className: ['list-cell', className].join(' ') }, props)));
};

var variants$2 = {
    card: function (_a) {
        var gap = _a.gap;
        return "gap-" + gap;
    },
};
var ListContext = React__default['default'].createContext({});
var useListContext = function () {
    return React__default['default'].useContext(ListContext);
};
var ListHeaders = function (_a) {
    var columns = _a.columns, sortState = _a.sortState, setSort = _a.setSort;
    var handleSortClick = function (index) { return function () {
        if (sortState.index === index) {
            setSort(function (current) { return (__assign(__assign({}, current), { order: current.order === 'asc' ? 'desc' : 'asc' })); });
        }
        else {
            setSort({
                index: index,
                order: 'asc',
            });
        }
    }; };
    return (React__default['default'].createElement("div", { className: ["list-headers"].join(' ') }, columns.map(function (column, index) { return (React__default['default'].createElement("div", { onClick: column.sort ? handleSortClick(index) : undefined, className: [
            'list-cell flex items-center',
            column.sort ? 'cursor-pointer' : 'cursor-default',
            index === sortState.index ? 'text-primary-600' : 'text-gray-500',
            column.className,
        ].join(' '), key: column.name },
        React__default['default'].createElement("span", { className: "mr-1 font-bold" }, column.name),
        column.sort ? (React__default['default'].createElement(React__default['default'].Fragment, null, index === sortState.index ? (React__default['default'].createElement(Icon, { size: 16, role: "button", name: sortState.order === 'asc'
                ? 'sort-ascending'
                : 'sort-descending' })) : (React__default['default'].createElement(Icon, { role: "button", size: 16, onClick: handleSortClick(index), name: "switch-vertical" })))) : null)); })));
};
var List = function (_a) {
    var columns = _a.columns, data = _a.data, children = _a.children, className = _a.className, _b = _a.variant, variant = _b === void 0 ? 'card' : _b, _c = _a.gap, gap = _c === void 0 ? 2 : _c;
    var _d = React__default['default'].useState({}), sort = _d[0], setSort = _d[1];
    var sortedData = React__default['default'].useMemo(function () {
        var _a;
        if (sort.index !== undefined) {
            var sorted = columns ? data === null || data === void 0 ? void 0 : data.sort((_a = columns[sort.index]) === null || _a === void 0 ? void 0 : _a.sort) : data;
            return sort.order === 'desc' ? sorted === null || sorted === void 0 ? void 0 : sorted.reverse() : sorted;
        }
        return data;
    }, [sort, data, columns]);
    var value = React__default['default'].useMemo(function () { return ({
        columns: columns,
        variant: variant,
    }); }, [columns, variant]);
    return (React__default['default'].createElement(ListContext.Provider, { value: value },
        React__default['default'].createElement("div", { className: ['list', variants$2[variant]({ gap: gap }), className !== null && className !== void 0 ? className : ''].join(' ') },
            columns ? (React__default['default'].createElement(ListHeaders, { sortState: sort, setSort: setSort, columns: columns })) : null,
            children({
                data: sortedData || [],
            }))));
};
List.Cell = ListCell;
List.Row = ListRow;

var sizes$2 = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    '2xl': 16,
};
var Loader = function (_a) {
    var _b, _c;
    var _d = _a.size, size = _d === void 0 ? 'md' : _d, _e = _a.color, color = _e === void 0 ? 'primary-800' : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    return (React__default['default'].createElement("svg", { className: "animate-spin h-" + ((_b = sizes$2[size]) !== null && _b !== void 0 ? _b : size) + " w-" + ((_c = sizes$2[size]) !== null && _c !== void 0 ? _c : size) + " text-" + color + " " + className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
        React__default['default'].createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        React__default['default'].createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })));
};

function XIcon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React__namespace.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M6 18L18 6M6 6l12 12"
  }));
}

var useModalTransition = function (_a) {
    var _b = _a.defaultOpen, defaultOpen = _b === void 0 ? false : _b, _c = _a.onOpenDuration, onOpenDuration = _c === void 0 ? 0 : _c, onCloseDuration = _a.onCloseDuration, callbacks = _a.callbacks;
    var _d = React__default['default'].useState('closed'), state = _d[0], setState = _d[1];
    var open = React__default['default'].useCallback(function () {
        var _a;
        setState('opening');
        (_a = callbacks.opening) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        setTimeout(function () {
            var _a;
            setState('opened');
            (_a = callbacks.opened) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        }, onOpenDuration);
    }, [onOpenDuration, callbacks]);
    var close = React__default['default'].useCallback(function () {
        var _a;
        setState('closing');
        (_a = callbacks.closing) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        setTimeout(function () {
            var _a;
            setState('closed');
            (_a = callbacks.closed) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        }, onCloseDuration !== null && onCloseDuration !== void 0 ? onCloseDuration : onOpenDuration);
    }, [onCloseDuration, onOpenDuration, callbacks]);
    React__default['default'].useEffect(function () {
        if (defaultOpen) {
            setState('opened');
        }
        else {
            setState('closed');
        }
    }, [defaultOpen]);
    return {
        state: state,
        open: open,
        close: close,
        isOpen: ['opening', 'opened'].includes(state),
        isClose: ['closing', 'closed'].includes(state),
    };
};

var sizes$1 = {
    xs: 'w-1/6',
    sm: 'w-2/6',
    md: 'w-3/6',
    lg: 'w-4/6',
    xl: 'w-5/6',
    full: 'w-full',
};
var fades = {
    fade: {
        in: 'translate-y-0 sm:scale-100',
        out: 'translate-y-4 sm:translate-y-0 sm:scale-95',
    },
    fadeTop: { in: '-translate-y-0', out: '-translate-y-20' },
    fadeRight: { in: '-translate-x-0', out: 'translate-x-20' },
    fadeBottom: { in: '-translate-y-0', out: 'translate-y-20' },
    fadeLeft: { in: '-translate-x-0', out: '-translate-x-20' },
};
var generateFadeAnimations = function () {
    return Object.entries(fades).reduce(function (acc, fadeEntry) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[fadeEntry[0]] = {
            container: {
                in: 'fixed inset-0 z-10 overflow-y-auto',
                out: 'sr-only',
            },
            background: {
                out: 'ease-in duration-300 opacity-0',
                in: 'ease-out duration-300 opacity-100',
            },
            modal: {
                out: "ease-in duration-200 opacity-0 " + fadeEntry[1].out,
                in: "ease-out duration-300 opacity-100 " + fadeEntry[1].in,
            },
        }, _a)));
    }, {});
};
var animations$1 = __assign({}, generateFadeAnimations());
var getContainerClassNames = function (animation, state) {
    var _a, _b;
    switch (state) {
        case 'closed':
            return (_a = animations$1[animation]) === null || _a === void 0 ? void 0 : _a.container.out;
        case 'closing':
        case 'opened':
        case 'opening':
            return (_b = animations$1[animation]) === null || _b === void 0 ? void 0 : _b.container.in;
        default:
            return '';
    }
};
var getBackgroundClassNames = function (animation, state) {
    var _a, _b, _c;
    var base = 'fixed flex inset-0 bg-gray-500 bg-opacity-75 transition-opacity';
    switch (state) {
        case 'closed':
            return base + " " + ((_a = animations$1[animation]) === null || _a === void 0 ? void 0 : _a.background.out);
        case 'closing':
            return base + " " + ((_b = animations$1[animation]) === null || _b === void 0 ? void 0 : _b.background.out);
        case 'opened':
        case 'opening':
            return base + " " + ((_c = animations$1[animation]) === null || _c === void 0 ? void 0 : _c.background.in);
        default:
            return '';
    }
};
var getModalDialodClassNames = function (animation, state, size) {
    var _a, _b;
    var base = sizes$1[size] + " text-foreground flex align-bottom bg-white rounded-lg text-left overflow-visible shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-full p-2";
    switch (state) {
        case 'closed':
        case 'closing':
            return base + " " + ((_a = animations$1[animation]) === null || _a === void 0 ? void 0 : _a.modal.out);
        case 'opened':
        case 'opening':
            return base + " " + ((_b = animations$1[animation]) === null || _b === void 0 ? void 0 : _b.modal.in);
        default:
            return '';
    }
};
var getModalContainerlClassNames = function (position) {
    var base = 'flex min-h-screen pt-4 px-4 pb-20 text-center sm:p-0';
    switch (position) {
        case 'top':
            return base + " items-start justify-center";
        case 'right':
            return base + " items-center justify-end";
        case 'bottom':
            return base + " items-end justify-center ";
        case 'left':
            return base + " items-center";
        case 'center':
        default:
            return base + " items-center justify-center";
    }
};
var getCloseButtonClassNames = function (position, size) {
    var base = 'absolute bg-background rounded-full w-6 h-6 p-1 flex items-center justify-center';
    if (size === 'full' || position === 'right') {
        return base + " top-1 right-2";
    }
    return base + " -right-8 top-0";
};
var getModalClassNames = function (animation, state, position, size) {
    var classNames = {};
    classNames.container = getContainerClassNames(animation, state);
    classNames.background = getBackgroundClassNames(animation, state);
    classNames.modal = getModalDialodClassNames(animation, state, size);
    classNames.modalContainer = getModalContainerlClassNames(position);
    classNames.closeButton = getCloseButtonClassNames(position, size);
    return classNames;
};

var Modal = function (_a) {
    var _b = _a.animation, animation = _b === void 0 ? 'fade' : _b, open = _a.open, onClose = _a.onClose, children = _a.children, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.position, position = _d === void 0 ? 'center' : _d, _e = _a.closeOnOverlayDoubleClick, closeOnOverlayDoubleClick = _e === void 0 ? true : _e, ariaLabelledBy = _a["aria-labelledby"], ariaLabel = _a["aria-label"], _f = _a.alwaysRender, alwaysRender = _f === void 0 ? false : _f;
    var modalState = useModalTransition({
        defaultOpen: open,
        onOpenDuration: 300,
        onCloseDuration: 300,
        callbacks: {
            closed: onClose,
        },
    });
    var onClickOutside = function (event) {
        event.stopPropagation();
        if (closeOnOverlayDoubleClick)
            modalState.close();
    };
    var classes = React__default['default'].useMemo(function () { return getModalClassNames(animation, modalState.state, position, size); }, [modalState.state, position, size, animation]);
    return open || alwaysRender ? (React__default['default'].createElement("div", { className: "" + classes.container, "aria-labelledby": ariaLabelledBy, role: "dialog", "aria-label": ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : 'modal', "aria-modal": "true" },
        React__default['default'].createElement("div", { onDoubleClick: onClickOutside, className: "" + classes.background, "aria-hidden": "true" }),
        React__default['default'].createElement("div", { className: "" + classes.modalContainer },
            React__default['default'].createElement("div", { onDoubleClick: function (event) { return event.stopPropagation(); }, className: "" + classes.modal },
                React__default['default'].createElement(XIcon, { role: "button", className: classes.closeButton, onClick: modalState.close }),
                children)))) : (React__default['default'].createElement(React__default['default'].Fragment, null));
};

var sizes = {
    xs: {
        container: 'px-1 text-xs',
        icon: 'p-1',
    },
    sm: {
        container: 'px-1 text-sm',
        icon: 'p-1',
    },
    md: {
        container: 'p-1',
        icon: 'p-1',
    },
    lg: {
        container: 'py-2 px-1',
        icon: 'p-1',
    },
    xl: {
        container: 'text-lg py-3 px-1',
        icon: '',
    },
    '2xl': {
        container: 'text-xl py-4 px-1',
        icon: '',
    },
};
var authorizedKeys = [
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'NumLock',
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    'NumpadDecimal',
    'ArrowDown',
    'ArrowUp',
    'ArrowLeft',
    'ArrowRight',
    'Escape',
    'Tab',
    'Delete',
    'Backspace',
];
var NumberInput = function (_a) {
    var _b, _c, _d;
    var name = _a.name, id = _a.id, ariaLabelledBy = _a["aria-labelledby"], ariaLabel = _a["aria-label"], defaultValue = _a.value, onChange = _a.onChange; _a.label; var _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.step, step = _f === void 0 ? 1 : _f, tabIndex = _a.tabIndex, _g = _a.size, size = _g === void 0 ? 'md' : _g, width = _a.width;
    var inputRef = React__default['default'].useRef(null);
    var _h = React__default['default'].useState(defaultValue !== null && defaultValue !== void 0 ? defaultValue : '0'), value = _h[0], setValue = _h[1];
    var handleChange = function (event) {
        setValue(event.target.value);
        onChange === null || onChange === void 0 ? void 0 : onChange(event);
    };
    var handleDecrement = function () {
        var _a, _b;
        if (inputRef.current) {
            var currentValue = parseInt(((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value) || '0', 10);
            var nativeInputValueSetter = (_b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')) === null || _b === void 0 ? void 0 : _b.set;
            nativeInputValueSetter === null || nativeInputValueSetter === void 0 ? void 0 : nativeInputValueSetter.call(inputRef.current, "" + (currentValue >= step ? currentValue - step : 0));
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
    var handleIncrement = function () {
        var _a, _b;
        if (inputRef.current) {
            var currentValue = parseInt(((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value) || '0', 10);
            var nativeInputValueSetter = (_b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')) === null || _b === void 0 ? void 0 : _b.set;
            nativeInputValueSetter === null || nativeInputValueSetter === void 0 ? void 0 : nativeInputValueSetter.call(inputRef.current, "" + (currentValue + step));
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
    var handleKeyDown = function (event) {
        if (!authorizedKeys.includes(event.code)) {
            event.stopPropagation();
            event.preventDefault();
        }
    };
    var sizeClassNames = sizes[size];
    return (React__default['default'].createElement("label", { className: "border border-gray-300 focus-within:text-primary-600 focus-within:border-primary-600 rounded outline-none focus:ring-2 ring-primary-200 text-black flex items-center " + ((_b = sizeClassNames === null || sizeClassNames === void 0 ? void 0 : sizeClassNames.container) !== null && _b !== void 0 ? _b : '') + " " + (width ? "w-" + width : '') + " " + (className !== null && className !== void 0 ? className : '') },
        React__default['default'].createElement("button", { className: "appearance-none focus:outline-none" },
            React__default['default'].createElement(Icon, { name: "minus", className: "cursor-pointer " + ((_c = sizeClassNames === null || sizeClassNames === void 0 ? void 0 : sizeClassNames.icon) !== null && _c !== void 0 ? _c : ''), onClick: handleDecrement })),
        React__default['default'].createElement("input", { ref: inputRef, className: "min-w-0 text-center flex-grow text-black focus:outline-none appereance-none", name: name, id: id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, value: value, type: "text", onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: tabIndex }),
        React__default['default'].createElement("button", { className: "appearance-none focus:outline-none" },
            React__default['default'].createElement(Icon, { name: "plus", className: "cursor-pointer " + ((_d = sizeClassNames === null || sizeClassNames === void 0 ? void 0 : sizeClassNames.icon) !== null && _d !== void 0 ? _d : ''), onClick: handleIncrement }))));
};

var Radio = function (_a) {
    var name = _a.name, id = _a.id, ariaLabelledBy = _a["aria-labelledby"], ariaLabel = _a["aria-label"], value = _a.value, onChange = _a.onChange, checked = _a.checked, defaultChecked = _a.defaultChecked, label = _a.label, _b = _a.labelPosition, labelPosition = _b === void 0 ? 'left' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    return !label ? (React__default['default'].createElement("div", { className: "cursor-pointer flex items-center m-1" },
        React__default['default'].createElement("div", { className: "h-2 w-2 m-1 rounded-full " + (checked
                ? 'bg-primary-500 ring ring-primary-500 ring-offset-2'
                : 'bg-gray-200 ring ring-gray-200 ring-offset-2') }),
        React__default['default'].createElement("input", { className: "appearance-none", name: name, id: id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, value: value, type: "radio", onChange: onChange, checked: checked, defaultChecked: defaultChecked }))) : (React__default['default'].createElement("label", { className: "cursor-pointer flex items-center " + className },
        labelPosition === 'left' && React__default['default'].createElement("span", { className: "mr-1" }, label),
        React__default['default'].createElement("div", { className: "h-2 w-2 m-1 rounded-full " + (checked
                ? 'bg-primary-500 ring ring-primary-500 ring-offset-2'
                : 'bg-gray-200 ring ring-gray-200 ring-offset-2') }),
        React__default['default'].createElement("input", { className: "appearance-none", name: name, id: id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, value: value, type: "radio", onChange: onChange, checked: checked, defaultChecked: defaultChecked }),
        labelPosition === 'right' && React__default['default'].createElement("span", { className: "ml-1" }, label)));
};

var Option = function (_a) {
    var isMulti = _a.isMulti, value = _a.value, valueKey = _a.valueKey, textKey = _a.textKey, option = _a.option, focused = _a.focused, _b = _a.renderOption, renderOption = _b === void 0 ? function (_a) {
        var option = _a.option, isSelected = _a.isSelected;
        return (React__default['default'].createElement("div", { className: "flex items-center" },
            option[textKey],
            isMulti && isSelected ? (React__default['default'].createElement(CheckIcon, { className: "fill-current h-4 w-4" })) : null));
    } : _b, onOptionClick = _a.onOptionClick;
    var isSelected = React__default['default'].useMemo(function () {
        var _a;
        return isMulti
            ? ((_a = value) === null || _a === void 0 ? void 0 : _a.findIndex(function (v) { return v[valueKey] === option[valueKey]; })) > -1
            : option[valueKey] === value;
    }, [value, valueKey, option, isMulti]);
    return (React__default['default'].createElement("div", { className: "truncate py-1 px-1 hover:bg-primary-600 hover:text-white cursor-pointer " + (focused === option ? 'bg-primary-600 text-white' : '') + " " + (isSelected && focused !== option ? 'text-primary-600' : ''), key: option[valueKey], id: option[valueKey], role: "option", "aria-selected": isSelected, onClick: function (event) { return onOptionClick(option, event); } }, renderOption({ option: option, isSelected: isSelected })));
};

var OptionList = React__default['default'].forwardRef(function (_a, ref) {
    var focused = _a.focused, isOpen = _a.isOpen, name = _a.name, options = _a.options, onOptionClick = _a.onOptionClick, valueKey = _a.valueKey, textKey = _a.textKey, value = _a.value, isMulti = _a.isMulti, renderOption = _a.renderOption;
    return (React__default['default'].createElement("div", { className: "z-10 absolute top-full left-0 " + (isOpen
            ? 'border shadow bg-white mt-1 max-h-40 w-full overflow-y-scroll'
            : 'sr-only'), ref: ref, "aria-label": name + " listbox", id: name + '-list', role: "listbox" }, options.map(function (option, index) { return (React__default['default'].createElement(Option, { renderOption: renderOption, focused: focused, key: option[valueKey], isMulti: isMulti, option: option, index: index, valueKey: valueKey, textKey: textKey, onOptionClick: onOptionClick, value: value })); })));
});
OptionList.displayName = 'OptionList';

var useClickOutsideHandler = function (ref, callback) {
    var callbackFnRef = React__default['default'].useRef(callback);
    React__default['default'].useEffect(function () {
        var handler = function (event) {
            var _a;
            if (ref.current && !ref.current.contains(event.target)) {
                (_a = callbackFnRef.current) === null || _a === void 0 ? void 0 : _a.call(callbackFnRef);
            }
        };
        // Bind the event listener
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return function () {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [ref]);
    React__default['default'].useEffect(function () {
        callbackFnRef.current = callback;
    }, [callback]);
};

var Label = function (_a) {
    var variant = _a.variant, id = _a.id, children = _a.children;
    return variant === 'inside' ? (React__default['default'].createElement("label", { htmlFor: id, className: "text-xs text-gray-500 px-2 absolute top-0 left-0" }, children)) : (React__default['default'].createElement("label", { htmlFor: id, className: "text-xs text-gray-500 px-2" }, children));
};

var defaultFilterOptions = function (_a) {
    var options = _a.options, textKey = _a.textKey, search = _a.search;
    return options.filter(function (option) {
        var _a;
        return (_a = option[textKey]) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace(/\s+/g, '').includes(search.toLowerCase().replace(/\s+/g, ''));
    });
};
var getContainerClassName = function (_a) {
    var disabled = _a.disabled, readOnly = _a.readOnly, isLoading = _a.isLoading, label = _a.label, labelVariant = _a.labelVariant, className = _a.className;
    return ("relative border " + (!disabled && !readOnly && !isLoading
        ? 'focus-within:border-primary-600'
        : '') + " bg-background border-gray-300 rounded p-2 " + (label && labelVariant === 'inside' ? 'pt-4' : '') + " flex items-center " + (disabled ? 'bg-gray-50 cursor-not-allowed pointer-events-none' : '') + " " + (className !== null && className !== void 0 ? className : '')).replace(/ +(?= )/g, ' ');
};
var Select = React__default['default'].forwardRef(function (_a, ref) {
    var _b, _c;
    var className = _a.className, containerClassNameProp = _a.containerClassName, id = _a.id, _d = _a.name, name = _d === void 0 ? '' : _d, _e = _a.options, options = _e === void 0 ? [] : _e, placeholder = _a.placeholder, onChange = _a.onChange, onSearchChange = _a.onSearchChange, value = _a.value, parentRef = _a.parentRef, disabled = _a.disabled, label = _a.label, _f = _a.labelVariant, labelVariant = _f === void 0 ? 'outside' : _f, readOnly = _a.readOnly, tabIndex = _a.tabIndex, isLoading = _a.isLoading, isSearchable = _a.isSearchable, isMulti = _a.isMulti, isMultiLine = _a.isMultiLine, additionalInputProps = _a.inputProps, searchValue = _a.searchValue, _g = _a.textKey, textKey = _g === void 0 ? 'label' : _g, _h = _a.filterOptions, filterOptions = _h === void 0 ? defaultFilterOptions : _h, _j = _a.valueKey, valueKey = _j === void 0 ? 'value' : _j, _k = _a.renderSelected, renderSelected = _k === void 0 ? function (value) {
        return isMulti
            ? value
                .map(function (value) { return value[textKey]; })
                .join(', ')
            : value[textKey];
    } : _k, renderOption = _a.renderOption;
    var InputComponent = isMultiLine ? 'textarea' : 'input';
    var _l = React__default['default'].useState(false), isOpen = _l[0], setOpen = _l[1];
    var _m = React__default['default'].useState(searchValue), search = _m[0], setSearch = _m[1];
    var _o = React__default['default'].useState(value || undefined), focused = _o[0], setFocused = _o[1];
    var inputRef = React__default['default'].useRef(null);
    var containerRef = React__default['default'].useRef(null);
    React__default['default'].useImperativeHandle(ref, function () { return inputRef.current; });
    React__default['default'].useImperativeHandle(parentRef, function () { return containerRef.current; });
    useClickOutsideHandler(containerRef, function () {
        setOpen(false);
        setSearch(undefined);
    });
    var inputProps = React__default['default'].useMemo(function () { return (__assign({ tabIndex: tabIndex !== null && tabIndex !== void 0 ? tabIndex : -1 }, additionalInputProps)); }, [tabIndex, additionalInputProps]);
    var finalOptions = React__default['default'].useMemo(function () {
        return !isSearchable || !search
            ? options
            : filterOptions({ options: options, textKey: textKey, search: search });
    }, [isSearchable, options, textKey, search, filterOptions]);
    var handleOpen = React__default['default'].useCallback(function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!disabled && !readOnly) {
            setOpen(true);
        }
    }, [disabled, readOnly]);
    // Click an option change the value only
    var handleClickForMulti = React__default['default'].useCallback(function (option) {
        if (!value) {
            onChange === null || onChange === void 0 ? void 0 : onChange([option]);
            return;
        }
        var typedValue = value;
        var index = typedValue === null || typedValue === void 0 ? void 0 : typedValue.findIndex(function (v) { return v[valueKey] === option[valueKey]; });
        // Handle if we click on an option which is already in value
        if (index > -1) {
            var tmp = __spreadArray([], typedValue);
            tmp.splice(index, 1);
            onChange === null || onChange === void 0 ? void 0 : onChange(__spreadArray([], tmp));
        }
        else {
            onChange === null || onChange === void 0 ? void 0 : onChange(__spreadArray(__spreadArray([], typedValue), [option]));
        }
    }, [onChange, value]);
    // Click an option change search and value then close the options
    var handleClickForSingle = React__default['default'].useCallback(function (option) {
        onChange === null || onChange === void 0 ? void 0 : onChange(option);
        setSearch(undefined);
        inputRef.current.focus();
        setOpen(false);
    }, [inputRef, onChange]);
    var handleKeyDown = React__default['default'].useCallback(function (event) {
        if (!isOpen && event.key !== 'ArrowDown') {
            return;
        }
        if (event.key.includes('Arrow') || event.key === 'Enter')
            event.preventDefault();
        switch (event.key) {
            case 'Tab':
            case 'Escape':
                setOpen(false);
                break;
            case 'ArrowUp':
                {
                    var index_1 = finalOptions.findIndex(function (option) { return option === focused; });
                    setFocused(function (current) {
                        return finalOptions[index_1 - 1] || current;
                    });
                }
                break;
            case 'ArrowDown':
                if (!isOpen) {
                    handleOpen();
                }
                else {
                    var index_2 = finalOptions.findIndex(function (option) { return option === focused; });
                    setFocused(function (current) {
                        return finalOptions[index_2 + 1] || current;
                    });
                }
                break;
            case 'Enter':
                isMulti
                    ? handleClickForMulti(focused)
                    : handleClickForSingle(focused);
                break;
        }
    }, [
        handleClickForMulti,
        handleClickForSingle,
        options,
        finalOptions,
        isMulti,
        isOpen,
        focused,
    ]);
    var handleInputChange = React__default['default'].useCallback(function (event) {
        if (isSearchable) {
            onSearchChange === null || onSearchChange === void 0 ? void 0 : onSearchChange(event.target.value);
            setSearch(event.target.value);
        }
    }, [isSearchable, onSearchChange]);
    var containerClassName = React__default['default'].useMemo(function () {
        return getContainerClassName({
            disabled: disabled,
            readOnly: readOnly,
            isLoading: isLoading,
            label: label,
            labelVariant: labelVariant,
            className: className,
        });
    }, [disabled, readOnly, isLoading, label, labelVariant, className]);
    // When value change, change the focus
    React__default['default'].useEffect(function () {
        var selected = value
            ? options.findIndex(function (option) { return option[valueKey] === value[valueKey]; })
            : 0;
        setFocused(selected > -1 ? selected : 0);
    }, [value, options, valueKey]);
    React__default['default'].useEffect(function () {
        setSearch(searchValue);
    }, [searchValue]);
    // Set focus
    React__default['default'].useEffect(function () {
        if (!focused && finalOptions.length)
            setFocused(finalOptions[0]);
        if ((finalOptions === null || finalOptions === void 0 ? void 0 : finalOptions.findIndex(function (option) { return option === focused; })) < 0) {
            setFocused(finalOptions[0]);
        }
    }, [focused, finalOptions]);
    var selectRender = (React__default['default'].createElement("div", { onClick: handleOpen, ref: containerRef, className: containerClassName, "aria-disabled": disabled, onKeyDown: handleKeyDown },
        label && labelVariant === 'inside' ? (React__default['default'].createElement(Label, { variant: "inside", id: id }, label)) : null,
        React__default['default'].createElement("div", { className: "w-full flex items-center flex-grow", "aria-readonly": readOnly },
            isMulti ? (React__default['default'].createElement(React__default['default'].Fragment, null,
                value && (React__default['default'].createElement("div", { className: "flex outline-none mr-1" }, renderSelected(value || []))),
                React__default['default'].createElement(InputComponent, __assign({ className: ("flex-grow outline-none " + (isLoading
                        ? 'bg-transparent pointer-events-none cursor-not-allowed'
                        : '') + " " + (disabled ? 'opacity-50' : '')).replace(/ +(?= )/g, ' '), "aria-expanded": isOpen, "aria-controls": name + '-list', "aria-owns": name + '-list', "aria-activedescendant": (_b = options.find(function (option) { return option[valueKey] === value; })) === null || _b === void 0 ? void 0 : _b[valueKey], role: "combobox", "aria-haspopup": "listbox", id: id, placeholder: placeholder || 'Select...' }, inputProps, { ref: inputRef, disabled: disabled, readOnly: readOnly || !isSearchable, onKeyDown: handleKeyDown, value: search, onChange: handleInputChange })))) : (React__default['default'].createElement(InputComponent, __assign({ className: ("bg-transparent w-full outline-none " + (isLoading ? 'pointer-events-none cursor-not-allowed' : '') + " " + (disabled ? 'opacity-50' : '')).replace(/ +(?= )/g, ' '), "aria-expanded": isOpen, "aria-controls": name + '-list', "aria-autocomplete": name + '-list', "aria-activedescendant": (_c = options.find(function (option) { return option[valueKey] === value; })) === null || _c === void 0 ? void 0 : _c[valueKey], role: "combobox", "aria-haspopup": "listbox", type: "text", id: id }, inputProps, { ref: inputRef, disabled: disabled, readOnly: readOnly || isLoading || !isSearchable, placeholder: placeholder || 'Select...', onChange: handleInputChange, onKeyDown: handleKeyDown, value: search !== null && search !== void 0 ? search : ((value === null || value === void 0 ? void 0 : value[textKey]) || '') }))),
            isLoading || readOnly ? null : (React__default['default'].createElement(ChevronDownIcon, { width: 12, height: 12, className: "fill-current " + (isOpen ? 'text-primary-600' : 'text-gray-400') })),
            isLoading && (React__default['default'].createElement(Loader, { className: "mx-1", size: "sm", color: "primary-800" }))),
        isLoading ? null : (React__default['default'].createElement(OptionList, { isMulti: isMulti, name: name, isOpen: isOpen, options: finalOptions, value: value, valueKey: valueKey, textKey: textKey, focused: focused, renderOption: renderOption, onOptionClick: function (option, event) {
                event.preventDefault();
                event.stopPropagation();
                isMulti
                    ? handleClickForMulti(option)
                    : handleClickForSingle(option);
            } }))));
    return label && labelVariant === 'outside' ? (React__default['default'].createElement("div", { className: "flex flex-col " + (containerClassNameProp !== null && containerClassNameProp !== void 0 ? containerClassNameProp : '') },
        React__default['default'].createElement(Label, { variant: "outside", id: id }, label),
        selectRender)) : (selectRender);
});
Select.displayName = 'Select';

var SwitchButton = function (_a) {
    var className = _a.className, children = _a.children, checked = _a.checked, props = __rest(_a, ["className", "children", "checked"]);
    return (React__default['default'].createElement("label", { className: "p-2 border border-gray-200 rounded hover:shadow " + (checked ? 'bg-primary-700 text-white' : 'shadow') + (className !== null && className !== void 0 ? className : '') },
        children,
        React__default['default'].createElement("input", __assign({ type: "checkbox", className: "opacity-5 sr-only" }, props, { size: undefined }))));
};
var defaultSizes = {
    xs: {
        label: 4,
        ball: 3,
        ballRight: 4,
    },
    sm: {
        label: 5,
        ball: 4,
        ballRight: 5,
    },
    md: {
        label: 6,
        ball: 4,
        ballRight: 5,
    },
    lg: {
        label: 8,
        ball: 6,
        ballRight: 7,
    },
    xl: {
        label: 12,
        ball: 10,
        ballRight: 11,
    },
    '2xl': {
        label: 16,
        ball: 12,
        ballRight: 14,
    },
};
var SwitchDefault = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, checked = _a.checked, id = _a.id, size = _a.size, onChange = _a.onChange, labelPosition = _a.labelPosition, props = __rest(_a, ["className", "children", "checked", "id", "size", "onChange", "labelPosition"]);
    var _c = defaultSizes[size !== null && size !== void 0 ? size : 'md'], label = _c.label, ball = _c.ball, ballRight = _c.ballRight;
    return labelPosition === 'inside' || !labelPosition ? (React__default['default'].createElement("label", { htmlFor: id, className: "block cursor-pointer h-" + label + " flex items-center relative rounded-full px-2 hover:shadow " + (checked
            ? 'border border-primary-500 bg-primary-700 text-white'
            : 'border border-gray-500 bg-gray-500 text-white') + " " + className },
        React__default['default'].createElement("span", { className: "px-1 " + (checked ? "mr-" + ball : "ml-" + ball) }, children),
        React__default['default'].createElement("div", { className: "absolute h-" + ball + " top-1/2 flex left-1 right-" + ballRight + " duration-300 transition-all transform -translate-y-1/2 " + (checked ? 'translate-x-full' : '') },
            React__default['default'].createElement("div", { className: "h-" + ball + " w-" + ball + " rounded-full bg-white border border-gray-500" })),
        React__default['default'].createElement("input", __assign({ onChange: onChange, id: id, checked: checked, type: "checkbox", className: "opacity-5 sr-only" }, props)))) : (React__default['default'].createElement("label", { htmlFor: id, className: "flex" },
        labelPosition === 'left' && React__default['default'].createElement("span", { className: "mr-1" }, children),
        React__default['default'].createElement("div", { className: "block cursor-pointer w-" + ball * 3 + " h-" + label + " flex items-center relative rounded-full px-2 hover:shadow " + (checked
                ? 'border border-primary-500 bg-primary-700 text-white'
                : 'border border-gray-500 bg-gray-500 text-white') + " " + className },
            React__default['default'].createElement("div", { className: "absolute h-" + ball + " top-1/2 flex left-1 right-" + ballRight + " duration-300 transition-all transform -translate-y-1/2 " + (checked ? 'translate-x-full' : '') },
                React__default['default'].createElement("div", { className: "h-" + ball + " w-" + ball + " rounded-full bg-white border border-gray-500" })),
            React__default['default'].createElement("input", __assign({ onChange: onChange, id: id, checked: checked, type: "checkbox", className: "opacity-5 sr-only" }, props))),
        labelPosition === 'right' && React__default['default'].createElement("span", { className: "ml-1" }, children)));
};
var SwitchButtons = function (_a) {
    var className = _a.className; _a.children; _a.size; var checked = _a.checked, offChildren = _a.offChildren, onChildren = _a.onChildren, props = __rest(_a, ["className", "children", "size", "checked", "offChildren", "onChildren"]);
    return (React__default['default'].createElement("label", { className: "cursor-pointer hover:shadow flex shadow-inner rounded border-gray-200 border rounded " + (className !== null && className !== void 0 ? className : '') },
        React__default['default'].createElement("div", { className: "p-2 rounded mr-1 " + (!checked ? 'bg-primary-700 text-white' : '') }, offChildren),
        React__default['default'].createElement("div", { className: "p-2 rounded " + (checked ? 'bg-primary-700 text-white' : '') }, onChildren),
        React__default['default'].createElement("input", __assign({ type: "checkbox", className: "opacity-5 sr-only" }, props))));
};
var variants$1 = {
    button: SwitchButton,
    default: SwitchDefault,
    buttons: SwitchButtons,
};
var Switch = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? 'default' : _b, checked = _a.checked, defaultChecked = _a.defaultChecked, onChange = _a.onChange, props = __rest(_a, ["variant", "checked", "defaultChecked", "onChange"]);
    var _c = React__default['default'].useState(checked || defaultChecked), isChecked = _c[0], setIsChecked = _c[1];
    React__default['default'].useEffect(function () {
        setIsChecked(checked);
    }, [checked]);
    var handleChange = function (event) {
        if (!onChange) {
            setIsChecked(!isChecked);
        }
        else {
            onChange(event);
        }
    };
    var Component = variants$1[variant]
        ? variants$1[variant](__assign({ checked: checked, onChange: handleChange }, props))
        : variants$1.default(__assign({ checked: checked, onChange: handleChange }, props));
    return Component;
};

var TableBody = function (_a, ref) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React__default['default'].createElement("tbody", __assign({ ref: ref }, props), children));
};
var TableBody$1 = React__default['default'].forwardRef(TableBody);

var TableHead = function (_a) {
    var columns = _a.columns, children = _a.children, props = __rest(_a, ["columns", "children"]);
    if (columns)
        return (React__default['default'].createElement("thead", __assign({}, props),
            React__default['default'].createElement("tr", { className: "table-head-row" }, columns.map(function (column) { return (React__default['default'].createElement("th", { className: ['table-head', column.className].join(' '), key: column.name }, column.name)); }))));
    return React__default['default'].createElement("thead", __assign({}, props), children);
};

var TableHeadCell = function (_a) {
    var children = _a.children, className = _a.className, sortable = _a.sortable, sort = _a.sort, onSort = _a.onSort, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, props = __rest(_a, ["children", "className", "sortable", "sort", "onSort", "onClick", "onMouseEnter", "onMouseLeave"]);
    var isCurrentSort = (sort === null || sort === void 0 ? void 0 : sort.field) === sortable;
    var _b = React__default['default'].useState(false), isHover = _b[0], setIsHover = _b[1];
    return (React__default['default'].createElement("th", __assign({ onMouseEnter: function (e) {
            onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(e);
            setIsHover(true);
        }, onMouseLeave: function (e) {
            onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(e);
            setIsHover(false);
        }, className: [
            'table-head',
            sortable ? 'cursor-pointer relative' : '',
            className,
        ].join(' '), onClick: function (event) {
            if (sortable) {
                onSort === null || onSort === void 0 ? void 0 : onSort(sortable, isCurrentSort && (!(sort === null || sort === void 0 ? void 0 : sort.order) || (sort === null || sort === void 0 ? void 0 : sort.order) === 'asc')
                    ? 'desc'
                    : 'asc');
            }
            onClick === null || onClick === void 0 ? void 0 : onClick(event);
        } }, props), sortable ? (React__default['default'].createElement("div", { className: "table-head-cell" },
        React__default['default'].createElement("span", null, children),
        isCurrentSort ? (React__default['default'].createElement(Icon, { size: 16, className: "m-1", name: (sort === null || sort === void 0 ? void 0 : sort.order) === 'asc' ? 'sort-ascending' : 'sort-descending' })) : (React__default['default'].createElement(Icon, { size: 16, className: ['m-1', !isHover ? 'opacity-0' : undefined].join(' '), name: "sort-ascending" })))) : (children)));
};

var TableRow = function (_a, ref) {
    var children = _a.children, hoverable = _a.hoverable, className = _a.className, props = __rest(_a, ["children", "hoverable", "className"]);
    return (React__default['default'].createElement("tr", __assign({ ref: ref, className: [
            'table-body-row',
            hoverable ? 'hoverable' : undefined,
            className,
        ].join(' ') }, props), children));
};
var TableRow$1 = React__default['default'].forwardRef(TableRow);

var Table = function (_a) {
    var children = _a.children, className = _a.className; _a.hoverable; _a.data; var props = __rest(_a, ["children", "className", "hoverable", "data"]);
    return (React__default['default'].createElement("table", __assign({ className: ['table-container', className].join(' ') }, props), children));
};
Table.Head = TableHead;
Table.HeadCell = TableHeadCell;
Table.Body = TableBody$1;
Table.Row = TableRow$1;
var TableCell = function (_a, ref) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return (React__default['default'].createElement("td", __assign({ ref: ref, className: [className].join(' ') }, props), children));
};
Table.Cell = React__default['default'].forwardRef(TableCell);

var defaultRender = function (_a) {
    var array = _a.array, onDelete = _a.onDelete;
    return array === null || array === void 0 ? void 0 : array.map(function (string, index) { return (React__default['default'].createElement(Badge, { key: index, variant: "outline", className: "mr-1 px-1" },
        React__default['default'].createElement("span", null, string),
        React__default['default'].createElement(XIcon$1, { onClick: onDelete(index), className: "w-4 cursor-pointer" }))); });
};
var TextArrayInput = function (_a) {
    var disabled = _a.disabled, onInputChange = _a.onInputChange, onKeyDown = _a.onKeyDown, onChange = _a.onChange, value = _a.value, placeholder = _a.placeholder, ref = _a.ref, _b = _a.renderSelected, renderSelected = _b === void 0 ? defaultRender : _b, props = __rest(_a, ["disabled", "onInputChange", "onKeyDown", "onChange", "value", "placeholder", "ref", "renderSelected"]);
    var inputRef = React__default['default'].useRef(null);
    React__default['default'].useImperativeHandle(ref, function () { return inputRef.current; });
    var _c = React__default['default'].useState(''), inputValue = _c[0], setInputValue = _c[1];
    var _d = React__default['default'].useState(value !== null && value !== void 0 ? value : []), array = _d[0], setArray = _d[1];
    var handleInputChange = function (event) {
        onInputChange === null || onInputChange === void 0 ? void 0 : onInputChange(event);
        if (!event.defaultPrevented)
            setInputValue(event.target.value);
    };
    var handleKeyDown = function (event) {
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        if (event.key === 'Enter' && !event.defaultPrevented && inputValue.length) {
            var tmp = __spreadArray([], array);
            tmp.push(inputValue);
            onChange === null || onChange === void 0 ? void 0 : onChange(tmp);
            setArray(tmp);
            setInputValue('');
        }
        if (event.key === 'Backspace' &&
            !event.defaultPrevented &&
            inputValue.length === 0) {
            var tmp = __spreadArray([], array);
            tmp.pop();
            onChange === null || onChange === void 0 ? void 0 : onChange(tmp);
            setArray(tmp);
        }
    };
    var handleDelete = function (index) { return function () {
        var tmp = __spreadArray([], array);
        tmp.splice(index, 1);
        onChange === null || onChange === void 0 ? void 0 : onChange(tmp);
        setArray(tmp);
    }; };
    React__default['default'].useEffect(function () {
        value && setArray(value);
    }, [value]);
    return (React__default['default'].createElement("div", { className: "flex w-full border focus-within:border-primary-600 p-2 rounded outline-none focus-within:ring-2 ring-primary-200 text-black " + (disabled ? 'opacity-50 pointer-event-none' : '') },
        React__default['default'].createElement("div", { className: "flex" }, renderSelected({ array: array, onDelete: handleDelete })),
        React__default['default'].createElement("input", __assign({}, props, { type: "text", className: "flex-grow focus:outline-none", placeholder: placeholder !== null && placeholder !== void 0 ? placeholder : 'Type some Text...', ref: inputRef, value: inputValue, onChange: handleInputChange, onKeyDown: handleKeyDown }))));
};

var baseClassName = "border focus:border-primary-600 p-2 rounded outline-none focus:ring-2 ring-primary-200 text-black";
var withLabelClassName = "border focus:border-primary-600 p-2 pt-5 rounded outline-none focus:ring-2 ring-primary-200 text-black";
var TextInput = React__default['default'].forwardRef(function (_a, ref) {
    var autoResizeHeight = _a.autoResizeHeight, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.containerClassName, containerClassName = _c === void 0 ? '' : _c, multiline = _a.multiline, _d = _a.placeholder, placeholder = _d === void 0 ? 'Type here...' : _d, label = _a.label, _e = _a.labelVariant, labelVariant = _e === void 0 ? 'outside' : _e, id = _a.id, value = _a.value, defaultValue = _a.defaultValue, rows = _a.rows, onChange = _a.onChange, props = __rest(_a, ["autoResizeHeight", "className", "containerClassName", "multiline", "placeholder", "label", "labelVariant", "id", "value", "defaultValue", "rows", "onChange"]);
    var inputRef = React__default['default'].useRef(null);
    React__default['default'].useImperativeHandle(ref, function () { return inputRef; });
    var InputComponent = multiline ? 'textarea' : 'input';
    var rowsCount = multiline ? rows || 1 : undefined;
    var onInputChange = function (event) {
        if (multiline && autoResizeHeight && inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + 5 + "px";
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(event);
    };
    React__default['default'].useEffect(function () {
        var observer;
        if (multiline && autoResizeHeight && inputRef.current) {
            var resizeTextArea = function () {
                inputRef.current.style.height = "auto";
                inputRef.current.style.height = inputRef.current.scrollHeight + 5 + "px";
            };
            observer = new ResizeObserver(resizeTextArea);
            observer.observe(inputRef.current);
            resizeTextArea();
        }
        return function () {
            if (observer)
                observer.disconnect();
        };
    }, []);
    var labelRender = {
        inside: (React__default['default'].createElement("div", { className: "relative text-gray-500 focus-within:text-primary-700 " + containerClassName },
            React__default['default'].createElement("label", { className: "absolute px-2 py-1 text-xs", htmlFor: id }, label),
            React__default['default'].createElement(InputComponent, __assign({ id: id, placeholder: placeholder, className: withLabelClassName + " " + (autoResizeHeight ? 'resize-x' : '') + " " + className, ref: inputRef, value: value, defaultValue: defaultValue, onChange: onInputChange, rows: rowsCount }, props)))),
        outside: (React__default['default'].createElement("div", { className: "flex flex-col text-gray-500 focus-within:text-primary-700 " + containerClassName },
            React__default['default'].createElement("label", { className: "px-2 top-1 left-0 text-xs", htmlFor: id }, label),
            React__default['default'].createElement(InputComponent, __assign({ id: id, placeholder: placeholder, className: baseClassName + " " + (autoResizeHeight ? 'resize-x' : '') + " " + className, ref: inputRef, value: value, defaultValue: defaultValue, onChange: onInputChange, rows: rowsCount }, props)))),
    };
    return label && labelRender[labelVariant] ? (labelRender[labelVariant]) : (React__default['default'].createElement(InputComponent, __assign({ placeholder: placeholder, className: baseClassName + " " + (autoResizeHeight ? 'resize-x' : '') + " " + className, ref: inputRef, value: value, defaultValue: defaultValue, onChange: onInputChange, rows: rowsCount }, props)));
});
TextInput.displayName = 'TextInput';

var variants = {
    default: {
        toast: 'shadow bg-white rounded pt-2 text-black',
        progressBar: 'bg-black',
    },
    success: {
        toast: 'shadow bg-success-600 rounded pt-2 text-white',
        progressBar: 'bg-white opacity-50',
    },
    error: {
        toast: 'shadow bg-error-600 rounded pt-2 text-white',
        progressBar: 'bg-white opacity-50',
    },
    warning: {
        toast: 'shadow bg-warning-500 rounded pt-2 text-white',
        progressBar: 'bg-white opacity-50',
    },
    info: {
        toast: 'shadow bg-info-600 rounded pt-2 text-white',
        progressBar: 'bg-white opacity-50',
    },
};
var Toast = function (_a) {
    var _b, _c, _d, _e;
    var onClose = _a.onClose, duration = _a.duration, render = _a.render, variant = _a.variant, id = _a.id;
    var _f = React__default['default'].useState(false), mounted = _f[0], setMounted = _f[1];
    var onCloseRef = React__default['default'].useRef(onClose);
    var handleClose = function (_event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setMounted(false);
        setTimeout(function () {
            onCloseRef.current(id);
        }, 500);
    };
    React__default['default'].useEffect(function () {
        var timeout = setTimeout(function () {
            setMounted(false);
            setTimeout(function () {
                onCloseRef.current(id);
            }, 500);
        }, duration);
        return function () {
            clearTimeout(timeout);
        };
    }, [duration]);
    React__default['default'].useEffect(function () {
        setTimeout(function () { return setMounted(true); }, 100);
    }, []);
    React__default['default'].useEffect(function () {
        onCloseRef.current = onClose;
    }, [onClose]);
    return (React__default['default'].createElement("div", { onClick: handleClose, className: "z-20 mr-4 mt-1 w-72 transition duration-500 transition-transform transform  " + (mounted ? '' : 'translate-x-72') + " overflow-hidden flex flex-col " + ((_c = (_b = variants[variant]) === null || _b === void 0 ? void 0 : _b.toast) !== null && _c !== void 0 ? _c : variants.default.toast) },
        React__default['default'].createElement("div", { className: "flex-grow px-2" }, render),
        React__default['default'].createElement("div", { className: ((_e = (_d = variants[variant]) === null || _d === void 0 ? void 0 : _d.progressBar) !== null && _e !== void 0 ? _e : variants.default.progressBar) + " ease-linear mt-2 h-1 w-full transition transition-transform transform " + (mounted ? '-translate-x-full' : ''), style: { transitionDuration: Math.round(duration / 1000) + "s" } })));
};

var ToastContainer = function (_a) {
    var children = _a.children;
    return (React__default['default'].createElement("div", { style: { zIndex: -1 }, className: "mr-1 py-2 fixed bottom-0 right-0 w-72 overflow-hidden flex flex-col-reverse" }, children));
};

var ToastContext = React__default['default'].createContext({});
var ToastProvider = function (_a) {
    var children = _a.children, _b = _a.duration, duration = _b === void 0 ? 3000 : _b, _c = _a.maxConcurrent, maxConcurrent = _c === void 0 ? 5 : _c;
    var counterRef = React__default['default'].useRef(0);
    var _d = React__default['default'].useState([]), toasts = _d[0], setToasts = _d[1];
    var show = React__default['default'].useCallback(function (render, info) {
        var _a, _b;
        var newToast = {};
        newToast.id = counterRef.current;
        counterRef.current += 1;
        newToast.callback = info.callback;
        newToast.render = render;
        newToast.closed = false;
        newToast.variant = (_a = info.variant) !== null && _a !== void 0 ? _a : 'default';
        newToast.duration = (_b = info.duration) !== null && _b !== void 0 ? _b : duration;
        setToasts(__spreadArray(__spreadArray([], toasts), [newToast]));
    }, [toasts, duration]);
    var onCloseToast = React__default['default'].useCallback(function (toastId) {
        var _a, _b;
        var index = toasts.findIndex(function (_a) {
            var id = _a.id;
            return id === toastId;
        });
        if (index > -1) {
            (_b = (_a = toasts[index]) === null || _a === void 0 ? void 0 : _a.callback) === null || _b === void 0 ? void 0 : _b.call(_a);
            var tmp = __spreadArray([], toasts);
            tmp[index].closed = true;
            setToasts(tmp);
        }
    }, [toasts]);
    React__default['default'].useEffect(function () {
        if (toasts.length && toasts.every(function (_a) {
            var closed = _a.closed;
            return closed;
        })) {
            setToasts([]);
        }
    }, [toasts]);
    var value = React__default['default'].useMemo(function () { return ({ show: show }); }, [show]);
    return (React__default['default'].createElement(ToastContext.Provider, { value: value },
        children,
        React__default['default'].createElement(ToastContainer, null, toasts
            .filter(function (_a) {
            var closed = _a.closed;
            return !closed;
        })
            .slice(0, maxConcurrent)
            .map(function (toast) { return (React__default['default'].createElement(Toast, { id: toast.id, key: toast.id, duration: toast.duration, render: toast.render, variant: toast.variant, onClose: onCloseToast })); }))));
};
var useToast = function () {
    return React__default['default'].useContext(ToastContext);
};

var fadeIn = function (open) {
    return open ? 'ease-out duration-300 opacity-100' : 'ease-in duration-200 opacity-0';
};
var animations = {
    fadeIn: fadeIn,
};

var makeUUID = function (prefix, length) {
    if (prefix === void 0) { prefix = ''; }
    if (length === void 0) { length = 10; }
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return prefix.length > 0 ? prefix + "-" + result.join('') : result.join('');
};

var useDebounce = function (value, delay) {
    // State and setters for debounced value
    var _a = React__default['default'].useState(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    React__default['default'].useEffect(function () {
        // Update debounced value after delay
        var handler = setTimeout(function () {
            setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return function () {
            clearTimeout(handler);
        };
    }, [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
};

var Tooltip = function (_a) {
    var render = _a.render, children = _a.children, toolptipId = _a.toolptipId, _b = _a.position, position = _b === void 0 ? 'top' : _b;
    var _c = React__default['default'].useState(false), isOpen = _c[0], setIsOpen = _c[1];
    var visible = useDebounce(isOpen, 200);
    var id = React__default['default'].useMemo(function () { return toolptipId !== null && toolptipId !== void 0 ? toolptipId : makeUUID(); }, [toolptipId]);
    var handlerRef = React__default['default'].useRef();
    var handleOpen = function () {
        if (handlerRef.current)
            clearTimeout(handlerRef.current);
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    var handleClose = function () {
        setIsOpen(false);
    };
    var positionClassNames = React__default['default'].useMemo(function () {
        switch (position) {
            case 'right':
                return 'left-full ml-1';
            case 'left':
                return 'right-full mr-1';
            case 'bottom':
                return 'top-full mt-1';
            case 'top':
            default:
                return 'bottom-full mb-1';
        }
    }, [position]);
    return (React__default['default'].createElement("div", { "aria-describedby": id, className: "relative flex", onMouseEnter: handleOpen, onMouseLeave: handleClose },
        React__default['default'].createElement("div", { className: "flex" }, children),
        React__default['default'].createElement("div", { id: id, role: "tooltip", className: "absolute bg-white shadow-xl p-2 border border-gray-200 rounded " + positionClassNames + " " + animations.fadeIn(isOpen) + " " + (!visible && !isOpen && 'sr-only') + "\n        }" }, render)));
};

var StyledTopBar = injectClassNames('div')(templateObject_1 || (templateObject_1 = __makeTemplateObject(["fixed top-0 left-0 h-16 right-0 shadow-md px-3 flex items-center border-b border-primary-500"], ["fixed top-0 left-0 h-16 right-0 shadow-md px-3 flex items-center border-b border-primary-500"])));
var TopBar = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React__default['default'].createElement(StyledTopBar, __assign({}, props), children));
};
var templateObject_1;

var sortData = function (data, field, order) {
    if (order === void 0) { order = 'asc'; }
    var sortedData = __spreadArray([], data.sort(function (currentRow, nextRow) {
        return typeof currentRow[field] === 'number'
            ? currentRow[field] - nextRow[field]
            : ("" + currentRow[field]).localeCompare(nextRow[field]);
    }));
    return order === 'asc' ? sortedData : sortedData.reverse();
};
var useTableState = function (_a) {
    var data = _a.data, initialSort = _a.initialSort;
    var _b = React__default['default'].useState({
        data: data,
        sort: initialSort,
    }), state = _b[0], setState = _b[1];
    var onSort = function (field, order) {
        setState({
            data: sortData(data, field, order),
            sort: {
                field: field,
                order: order,
            },
        });
    };
    React__default['default'].useEffect(function () {
        var _a, _b;
        setState(__assign(__assign({}, state), { data: ((_a = state.sort) === null || _a === void 0 ? void 0 : _a.field)
                ? sortData(data, state.sort.field, (_b = state.sort) === null || _b === void 0 ? void 0 : _b.order)
                : data }));
    }, [data]);
    return __assign(__assign({}, state), { onSort: onSort });
};

exports.ActionButton = ActionButton;
exports.Avatar = Avatar;
exports.Badge = Badge;
exports.Box = Box;
exports.Button = Button;
exports.Checkbox = Checkbox;
exports.Drawer = Drawer;
exports.Grid = Grid;
exports.Icon = Icon;
exports.Link = Link;
exports.List = List;
exports.Loader = Loader;
exports.Modal = Modal;
exports.NumberInput = NumberInput;
exports.Radio = Radio;
exports.Select = Select;
exports.Switch = Switch;
exports.Table = Table;
exports.TextArrayInput = TextArrayInput;
exports.TextInput = TextInput;
exports.ToastProvider = ToastProvider;
exports.Tooltip = Tooltip;
exports.TopBar = TopBar;
exports.useClickOutsideHandler = useClickOutsideHandler;
exports.useDebounce = useClickOutsideHandler;
exports.useTableState = useTableState;
exports.useToast = useToast;
//# sourceMappingURL=index.js.map
