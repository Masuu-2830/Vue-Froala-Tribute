<template>
  <div id="app">
    <div class="mess">
        <h2 class="text-primary text-center">Vue + Froala Editor</h2>
        <div class="message">
            <div class="mess-body">
                <p class="text-secondary nomessages" v-if="messages.length == 0">
                    [No messages yet!]
                </p>
                <div v-bind:style="{right: 0+'px'}" class="messages">
                    <div v-for="message in messages" :key="message.message">
                        <div :class="{'note': message.type == 'note'}" v-html="message.message"></div>
                    </div>
                </div>
            </div>
        </div>
        <div>
          <ul class="nav nav-tabs" style="cursor: pointer">
            <li class="nav-item">
              <a href="#" class="nav-link" @click="advanceTab(1)" :class="{'active': current == 'reply'}">
                Reply
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="advanceTab(2)" :class="{'active': current == 'note'}">
                Note
              </a>
            </li>
          </ul>
          <div class="tab-content border-0">
            <div class="tab-form">
              <div class="from-group">
                <form class="form" @submit="addMessage">
                      <froala :tag="'textarea'" :config="config" v-model="message" name="message"></froala>
                      <button class="btn" type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import FroalaEditor from 'froala-editor';
import VueTribute from "vue-tribute";
import Tribute from "tributejs";
// import { XMLHttpRequest } from "xmlhttprequest";
var XMLHttpRequest = require("xhr2");
function remoteSearch() {
  return new Promise(function (resolve, reject) {
    var URL = "http://localhost/mas/hw/tmhw.php";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
          var data = xhr.responseText;
          console.log(data);
          // return data;
          resolve(data);
    };
    xhr.open("GET", URL,true);
    xhr.send();
  })
}
async function getValues() {
  try {
    const response = await fetch("http://localhost/mas/hw/tmhw.php", {mode: 'cors'});
    const data = await response.json();
    console.log(data);
    return data;
  } catch(error) {
    console.log(error.message);
  }
}

// function remoteSearch(text, cb) {
//   var URL = "http://localhost/mas/hw/tmhw.php";
//   let req = new XMLHttpRequest();
//   req.onreadystatechange = function() {
//     if (req.readyState === 4) {
//       if (req.status === 200) {
//         var data = (req.responseText);
//         console.log(data);
//         cb(data);
//       } else if (req.status === 403) {
//         cb([]);
//       }
//     }
//   };
//   req.open("GET", URL, true);
//   req.send();
// }
// remoteSearch();
var tribute1 = new Tribute({
  collection: [
    {
      trigger: '@',
      values: [
                { key: 'masood', value: 'Masood' },
                { key: 'kunal', value: 'Kunal Kumar' },
                { key: 'gatti', value: 'Gatti Ramya' },
                { key: 'mayank', value: 'Mayank Banga' },
                { key: 'ayush', value: 'Ayush Rastogi' },
                { key: 'vibhor', value: 'Vibhor Agarwal' }
              ],
      selectTemplate: function(item) {
        // return '<span class="fr-deletable fr-tribute">' + item.original.key + '</a></span>';
        return `<span contenteditable="false" class="mention fr-deletable fr-tribute">@` +
                item.original.value +
                "</span>"
      },
      noMatchTemplate: function () {
        return '<span style:"visibility: hidden;"></span>';
      }
    },
    {
      trigger: '#',
      values: async function () {
        const val = await remoteSearch();
        console.log(val);
        return val;
      },
      // values: async function (text, cb) {
      //   console.log("ds");
      //   const val = await remoteSearch(text, teammates => cb(teammates));
      //   console.log(val);
      //   console.log("dsss");
      //   return val;
      // },
      // values: remoteSearch(),
      // values: new Promise(() => remoteSearch()),
      // values: async function() {
      //   await getValues();
      // },
      // values: function() {
      //   getValues();
      // },
      // values: new Promise(() => getValues()),
      lookup: 'username',
      fillAttr: 'firstname',
      selectTemplate: function(item) {
        return `<span contenteditable="false" class="mention-h fr-deletable fr-tribute">#` + item.original.firstname + "</span>"
        // return `<span contenteditable="false" class="mention fr-deletable fr-tribute">@` +
        //         item.original.value +
        //         "</span>"
      },
      noMatchTemplate: function () {
        return '<span style:"visibility: hidden;"></span>';
      }
    }
  ]
});
// var tribute2 = new Tribute({
//       trigger: '#',
//       values: function (cb) {
//         remoteSearch(users => cb(users));
//       },
//       lookup: 'username',
//       fillAttr: 'firstname',
//       selectTemplate: function(item) {
//         console.log(this.values);
//         return `<span contenteditable="false" class="mention-h fr-deletable fr-tribute">#` + item.original.firstname + "</span>"
//       },
//       noMatchTemplate: function () {
//         return '<span style:"visibility: hidden;"></span>';
//       },
// });

FroalaEditor.DefineIcon('my_dropdown', {NAME: 'cog', SVG_KEY: 'cogs'});
  FroalaEditor.RegisterCommand('my_dropdown', {
    title: 'Advanced options',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: {
      'v1': 'Option 1',
      'v2': 'Option 2'
    },
    callback: function (cmd, val) {
      this.html.insert(val);
    },
    refreshOnShow: function ($btn, $dropdown) {
      console.log ('do refresh when show');
    }
  });
  FroalaEditor.DefineIcon('clear', {NAME: 'remove', SVG_KEY: 'remove'});
  FroalaEditor.RegisterCommand('clear', {
    title: 'Clear HTML',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
      this.html.set('');
      this.events.focus();
    }
  });

  FroalaEditor.DefineIcon('insert', {NAME: 'plus',  SVG_KEY: 'add'});
  FroalaEditor.RegisterCommand('insert', {
    title: 'Insert HTML',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
      this.html.insert('Regards');
    }
  });
export default {
  name: "App",
  components: {
    VueTribute,
    FroalaEditor
  },
  data() {
    const self = this;
    // console.log(self.current);
    return {
      message: '',
      current: 'reply',
      messages: [],
      members: [],
      config: {
        events: {
          initialized: function() {
            console.log(self.members);
            var editor = this;
            console.log(editor);
            tribute1.attach(editor.el);

            editor.events.on('keydown', function(e) {
              if (e.which == FroalaEditor.KEYCODE.ENTER && tribute1.isActive) {
                return false;
              }
            }, true);
            // if(self.current == 'reply') {
            //   tribute1.detach(editor.el);
            //   tribute2.attach(editor.el);

            //   editor.events.on('keydown', function(e) {
            //     if (e.which == FroalaEditor.KEYCODE.ENTER && tribute2.isActive) {
            //       return false;
            //     }
            //   }, true);
            // } else {
            //   tribute2.detach(editor.el)
            //   tribute1.attach(editor.el);

            //   editor.events.on('keydown', function(e) {
            //     if (e.which == FroalaEditor.KEYCODE.ENTER && tribute1.isActive) {
            //       return false;
            //     }
            //   }, true);
            // }
          }
        },
        placeholderText: "Edit Your Reply Here!",
        charCounterCount: false,
        toolbarButtons: [['bold', 'italic', 'underline', 'strikeThrough', 'insertHR'], ['my_dropdown', 'clear', 'insert'], ['undo', 'redo', 'selectAll']],
      },
    };
  },
  async beforeMount() {
      // fetch("http://localhost/mas/hw/tmhw.php")
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      //   this.members = data;
      //   // return data;
      // });
      await this.callApi();
  },
  mounted() {
    this.createTribute();
  },
  methods: {
    async callApi() {
      console.log("calling api");
      const response = await fetch("http://localhost/mas/hw/tmhw.php");
      const data = await response.json();
      console.log(data);
      this.members = data;
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      //   this.members = data;
      //   // return data;
      // });
    },
    createTribute() {
      console.log("creating tribute");
      console.log(this.members);
      var tribute2 = new Tribute({
        trigger: '#',
        values: this.members,
        lookup: 'username',
        fillAttr: 'firstname',
        selectTemplate: function(item) {
          console.log(this.values);
          return `<span contenteditable="false" class="mention-h fr-deletable fr-tribute">#` + item.original.firstname + "</span>"
        },
        noMatchTemplate: function () {
          return '<span style:"visibility: hidden;"></span>';
        },
      });
    },
    addMessage(e) {
      e.preventDefault();
      if(this.current == 'reply') {
        const mess = {
          "type": "reply",
          "message": this.message
        }
        this.messages.push(mess);
        console.log(this.messages)
        this.message = '';
      } else {
        const mess = {
          "type": "note",
          "message": this.message
        }
        this.messages.push(mess);
        console.log(this.messages)
        this.message = '';
      }
    },
    advanceTab(props) {
      if(props == 1) {
        this.current = 'reply';
      } else {
        this.current = 'note';
      }
      console.log(this.current);
    }
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.mess h2{
    font-size: 2.6em;
    margin-bottom: 10px;
}

.mess-body {
  font-size: 1.2em;
  text-align: right;
  margin-right: 20px;
}
.messages{
    min-height: 200px;
    overflow: auto;
    right: 0%;
}

.form {
  bottom: 0%;
}

.mention {
  color: #009be5 !important;
  background-color: #dbf2ff !important;
  padding: 0 4px;
}

.mention-h {
  color: blue !important;
  background-color: #dbf2ff !important;
  padding: 0 4px;
}
.note {
  color: orange;
}

/* .note p {
  background-color: rgb(100, 84, 84);
} */

.btn {
  font-size: 30px;
  margin-top: 10px;
  background-color: blue;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}
</style>


// https://app.helpwise.io/api/get-teammates?mailboxID=204420