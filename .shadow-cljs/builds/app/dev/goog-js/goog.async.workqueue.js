["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/async/workqueue.js"],"~:js","goog.provide(\"goog.async.WorkItem\");\ngoog.provide(\"goog.async.WorkQueue\");\ngoog.require(\"goog.asserts\");\ngoog.require(\"goog.async.FreeList\");\n/** @final @struct @constructor */ goog.async.WorkQueue = function() {\n  this.workHead_ = null;\n  this.workTail_ = null;\n};\n/** @define {number} */ goog.define(\"goog.async.WorkQueue.DEFAULT_MAX_UNUSED\", 100);\n/** @private @const @type {goog.async.FreeList<goog.async.WorkItem>} */ goog.async.WorkQueue.freelist_ = new goog.async.FreeList(function() {\n  return new goog.async.WorkItem;\n}, function(item) {\n  item.reset();\n}, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);\n/**\n * @param {function()} fn\n * @param {(Object|null|undefined)} scope\n */\ngoog.async.WorkQueue.prototype.add = function(fn, scope) {\n  var item = this.getUnusedItem_();\n  item.set(fn, scope);\n  if (this.workTail_) {\n    this.workTail_.next = item;\n    this.workTail_ = item;\n  } else {\n    goog.asserts.assert(!this.workHead_);\n    this.workHead_ = item;\n    this.workTail_ = item;\n  }\n};\n/**\n * @return {goog.async.WorkItem}\n */\ngoog.async.WorkQueue.prototype.remove = function() {\n  var item = null;\n  if (this.workHead_) {\n    item = this.workHead_;\n    this.workHead_ = this.workHead_.next;\n    if (!this.workHead_) {\n      this.workTail_ = null;\n    }\n    item.next = null;\n  }\n  return item;\n};\n/**\n * @param {goog.async.WorkItem} item\n */\ngoog.async.WorkQueue.prototype.returnUnused = function(item) {\n  goog.async.WorkQueue.freelist_.put(item);\n};\n/**\n * @private\n * @return {goog.async.WorkItem}\n */\ngoog.async.WorkQueue.prototype.getUnusedItem_ = function() {\n  return goog.async.WorkQueue.freelist_.get();\n};\n/** @final @struct @constructor */ goog.async.WorkItem = function() {\n  /** @type {?function()} */ this.fn = null;\n  /** @type {(?Object|null|undefined)} */ this.scope = null;\n  /** @type {?goog.async.WorkItem} */ this.next = null;\n};\n/**\n * @param {function()} fn\n * @param {(Object|null|undefined)} scope\n */\ngoog.async.WorkItem.prototype.set = function(fn, scope) {\n  this.fn = fn;\n  this.scope = scope;\n  this.next = null;\n};\ngoog.async.WorkItem.prototype.reset = function() {\n  this.fn = null;\n  this.scope = null;\n  this.next = null;\n};\n","~:source","// Copyright 2015 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\ngoog.provide('goog.async.WorkItem');\ngoog.provide('goog.async.WorkQueue');\n\ngoog.require('goog.asserts');\ngoog.require('goog.async.FreeList');\n\n\n// TODO(johnlenz): generalize the WorkQueue if this is used by more\n// than goog.async.run.\n\n\n\n/**\n * A low GC workqueue. The key elements of this design:\n *   - avoids the need for goog.bind or equivalent by carrying scope\n *   - avoids the need for array reallocation by using a linked list\n *   - minimizes work entry objects allocation by recycling objects\n * @constructor\n * @final\n * @struct\n */\ngoog.async.WorkQueue = function() {\n  this.workHead_ = null;\n  this.workTail_ = null;\n};\n\n\n/** @define {number} The maximum number of entries to keep for recycling. */\ngoog.define('goog.async.WorkQueue.DEFAULT_MAX_UNUSED', 100);\n\n\n/** @const @private {goog.async.FreeList<goog.async.WorkItem>} */\ngoog.async.WorkQueue.freelist_ = new goog.async.FreeList(\n    function() { return new goog.async.WorkItem(); },\n    function(item) { item.reset(); }, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);\n\n\n/**\n * @param {function()} fn\n * @param {Object|null|undefined} scope\n */\ngoog.async.WorkQueue.prototype.add = function(fn, scope) {\n  var item = this.getUnusedItem_();\n  item.set(fn, scope);\n\n  if (this.workTail_) {\n    this.workTail_.next = item;\n    this.workTail_ = item;\n  } else {\n    goog.asserts.assert(!this.workHead_);\n    this.workHead_ = item;\n    this.workTail_ = item;\n  }\n};\n\n\n/**\n * @return {goog.async.WorkItem}\n */\ngoog.async.WorkQueue.prototype.remove = function() {\n  var item = null;\n\n  if (this.workHead_) {\n    item = this.workHead_;\n    this.workHead_ = this.workHead_.next;\n    if (!this.workHead_) {\n      this.workTail_ = null;\n    }\n    item.next = null;\n  }\n  return item;\n};\n\n\n/**\n * @param {goog.async.WorkItem} item\n */\ngoog.async.WorkQueue.prototype.returnUnused = function(item) {\n  goog.async.WorkQueue.freelist_.put(item);\n};\n\n\n/**\n * @return {goog.async.WorkItem}\n * @private\n */\ngoog.async.WorkQueue.prototype.getUnusedItem_ = function() {\n  return goog.async.WorkQueue.freelist_.get();\n};\n\n\n\n/**\n * @constructor\n * @final\n * @struct\n */\ngoog.async.WorkItem = function() {\n  /** @type {?function()} */\n  this.fn = null;\n  /** @type {?Object|null|undefined} */\n  this.scope = null;\n  /** @type {?goog.async.WorkItem} */\n  this.next = null;\n};\n\n\n/**\n * @param {function()} fn\n * @param {Object|null|undefined} scope\n */\ngoog.async.WorkItem.prototype.set = function(fn, scope) {\n  this.fn = fn;\n  this.scope = scope;\n  this.next = null;\n};\n\n\n/** Reset the work item so they don't prevent GC before reuse */\ngoog.async.WorkItem.prototype.reset = function() {\n  this.fn = null;\n  this.scope = null;\n  this.next = null;\n};\n","~:compiled-at",1568699924163,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.async.workqueue.js\",\n\"lineCount\":78,\n\"mappings\":\"AAcAA,IAAAC,QAAA,CAAa,qBAAb,CAAA;AACAD,IAAAC,QAAA,CAAa,sBAAb,CAAA;AAEAD,IAAAE,QAAA,CAAa,cAAb,CAAA;AACAF,IAAAE,QAAA,CAAa,qBAAb,CAAA;AAiBA,mCAAAF,IAAAG,MAAAC,UAAA,GAAuBC,QAAQ,EAAG;AAChC,MAAAC,UAAA,GAAiB,IAAjB;AACA,MAAAC,UAAA,GAAiB,IAAjB;AAFgC,CAAlC;AAOA,wBAAAP,IAAAQ,OAAA,CAAY,yCAAZ,EAAuD,GAAvD,CAAA;AAIA,wEAAAR,IAAAG,MAAAC,UAAAK,UAAA,GAAiC,IAAIT,IAAAG,MAAAO,SAAJ,CAC7B,QAAQ,EAAG;AAAE,SAAO,IAAIV,IAAAG,MAAAQ,SAAX;AAAF,CADkB,EAE7B,QAAQ,CAACC,IAAD,CAAO;AAAEA,MAAAC,MAAA,EAAA;AAAF,CAFc,EAEKb,IAAAG,MAAAC,UAAAU,mBAFL,CAAjC;AASA;;;;AAAAd,IAAAG,MAAAC,UAAAW,UAAAC,IAAA,GAAqCC,QAAQ,CAACC,EAAD,EAAKC,KAAL,CAAY;AACvD,MAAIP,OAAO,IAAAQ,eAAA,EAAX;AACAR,MAAAS,IAAA,CAASH,EAAT,EAAaC,KAAb,CAAA;AAEA,MAAI,IAAAZ,UAAJ,CAAoB;AAClB,QAAAA,UAAAe,KAAA,GAAsBV,IAAtB;AACA,QAAAL,UAAA,GAAiBK,IAAjB;AAFkB,GAApB,KAGO;AACLZ,QAAAuB,QAAAC,OAAA,CAAoB,CAAC,IAAAlB,UAArB,CAAA;AACA,QAAAA,UAAA,GAAiBM,IAAjB;AACA,QAAAL,UAAA,GAAiBK,IAAjB;AAHK;AAPgD,CAAzD;AAkBA;;;AAAAZ,IAAAG,MAAAC,UAAAW,UAAAU,OAAA,GAAwCC,QAAQ,EAAG;AACjD,MAAId,OAAO,IAAX;AAEA,MAAI,IAAAN,UAAJ,CAAoB;AAClBM,QAAA,GAAO,IAAAN,UAAP;AACA,QAAAA,UAAA,GAAiB,IAAAA,UAAAgB,KAAjB;AACA,QAAI,CAAC,IAAAhB,UAAL;AACE,UAAAC,UAAA,GAAiB,IAAjB;AADF;AAGAK,QAAAU,KAAA,GAAY,IAAZ;AANkB;AAQpB,SAAOV,IAAP;AAXiD,CAAnD;AAkBA;;;AAAAZ,IAAAG,MAAAC,UAAAW,UAAAY,aAAA,GAA8CC,QAAQ,CAAChB,IAAD,CAAO;AAC3DZ,MAAAG,MAAAC,UAAAK,UAAAoB,IAAA,CAAmCjB,IAAnC,CAAA;AAD2D,CAA7D;AASA;;;;AAAAZ,IAAAG,MAAAC,UAAAW,UAAAK,eAAA,GAAgDU,QAAQ,EAAG;AACzD,SAAO9B,IAAAG,MAAAC,UAAAK,UAAAsB,IAAA,EAAP;AADyD,CAA3D;AAWA,mCAAA/B,IAAAG,MAAAQ,SAAA,GAAsBqB,QAAQ,EAAG;AAE/B,6BAAA,IAAAd,GAAA,GAAU,IAAV;AAEA,0CAAA,IAAAC,MAAA,GAAa,IAAb;AAEA,sCAAA,IAAAG,KAAA,GAAY,IAAZ;AAN+B,CAAjC;AAcA;;;;AAAAtB,IAAAG,MAAAQ,SAAAI,UAAAM,IAAA,GAAoCY,QAAQ,CAACf,EAAD,EAAKC,KAAL,CAAY;AACtD,MAAAD,GAAA,GAAUA,EAAV;AACA,MAAAC,MAAA,GAAaA,KAAb;AACA,MAAAG,KAAA,GAAY,IAAZ;AAHsD,CAAxD;AAQAtB,IAAAG,MAAAQ,SAAAI,UAAAF,MAAA,GAAsCqB,QAAQ,EAAG;AAC/C,MAAAhB,GAAA,GAAU,IAAV;AACA,MAAAC,MAAA,GAAa,IAAb;AACA,MAAAG,KAAA,GAAY,IAAZ;AAH+C,CAAjD;;\",\n\"sources\":[\"goog/async/workqueue.js\"],\n\"sourcesContent\":[\"// Copyright 2015 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\ngoog.provide('goog.async.WorkItem');\\ngoog.provide('goog.async.WorkQueue');\\n\\ngoog.require('goog.asserts');\\ngoog.require('goog.async.FreeList');\\n\\n\\n// TODO(johnlenz): generalize the WorkQueue if this is used by more\\n// than goog.async.run.\\n\\n\\n\\n/**\\n * A low GC workqueue. The key elements of this design:\\n *   - avoids the need for goog.bind or equivalent by carrying scope\\n *   - avoids the need for array reallocation by using a linked list\\n *   - minimizes work entry objects allocation by recycling objects\\n * @constructor\\n * @final\\n * @struct\\n */\\ngoog.async.WorkQueue = function() {\\n  this.workHead_ = null;\\n  this.workTail_ = null;\\n};\\n\\n\\n/** @define {number} The maximum number of entries to keep for recycling. */\\ngoog.define('goog.async.WorkQueue.DEFAULT_MAX_UNUSED', 100);\\n\\n\\n/** @const @private {goog.async.FreeList<goog.async.WorkItem>} */\\ngoog.async.WorkQueue.freelist_ = new goog.async.FreeList(\\n    function() { return new goog.async.WorkItem(); },\\n    function(item) { item.reset(); }, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);\\n\\n\\n/**\\n * @param {function()} fn\\n * @param {Object|null|undefined} scope\\n */\\ngoog.async.WorkQueue.prototype.add = function(fn, scope) {\\n  var item = this.getUnusedItem_();\\n  item.set(fn, scope);\\n\\n  if (this.workTail_) {\\n    this.workTail_.next = item;\\n    this.workTail_ = item;\\n  } else {\\n    goog.asserts.assert(!this.workHead_);\\n    this.workHead_ = item;\\n    this.workTail_ = item;\\n  }\\n};\\n\\n\\n/**\\n * @return {goog.async.WorkItem}\\n */\\ngoog.async.WorkQueue.prototype.remove = function() {\\n  var item = null;\\n\\n  if (this.workHead_) {\\n    item = this.workHead_;\\n    this.workHead_ = this.workHead_.next;\\n    if (!this.workHead_) {\\n      this.workTail_ = null;\\n    }\\n    item.next = null;\\n  }\\n  return item;\\n};\\n\\n\\n/**\\n * @param {goog.async.WorkItem} item\\n */\\ngoog.async.WorkQueue.prototype.returnUnused = function(item) {\\n  goog.async.WorkQueue.freelist_.put(item);\\n};\\n\\n\\n/**\\n * @return {goog.async.WorkItem}\\n * @private\\n */\\ngoog.async.WorkQueue.prototype.getUnusedItem_ = function() {\\n  return goog.async.WorkQueue.freelist_.get();\\n};\\n\\n\\n\\n/**\\n * @constructor\\n * @final\\n * @struct\\n */\\ngoog.async.WorkItem = function() {\\n  /** @type {?function()} */\\n  this.fn = null;\\n  /** @type {?Object|null|undefined} */\\n  this.scope = null;\\n  /** @type {?goog.async.WorkItem} */\\n  this.next = null;\\n};\\n\\n\\n/**\\n * @param {function()} fn\\n * @param {Object|null|undefined} scope\\n */\\ngoog.async.WorkItem.prototype.set = function(fn, scope) {\\n  this.fn = fn;\\n  this.scope = scope;\\n  this.next = null;\\n};\\n\\n\\n/** Reset the work item so they don't prevent GC before reuse */\\ngoog.async.WorkItem.prototype.reset = function() {\\n  this.fn = null;\\n  this.scope = null;\\n  this.next = null;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"async\",\"WorkQueue\",\"goog.async.WorkQueue\",\"workHead_\",\"workTail_\",\"define\",\"freelist_\",\"FreeList\",\"WorkItem\",\"item\",\"reset\",\"DEFAULT_MAX_UNUSED\",\"prototype\",\"add\",\"goog.async.WorkQueue.prototype.add\",\"fn\",\"scope\",\"getUnusedItem_\",\"set\",\"next\",\"asserts\",\"assert\",\"remove\",\"goog.async.WorkQueue.prototype.remove\",\"returnUnused\",\"goog.async.WorkQueue.prototype.returnUnused\",\"put\",\"goog.async.WorkQueue.prototype.getUnusedItem_\",\"get\",\"goog.async.WorkItem\",\"goog.async.WorkItem.prototype.set\",\"goog.async.WorkItem.prototype.reset\"]\n}\n"]