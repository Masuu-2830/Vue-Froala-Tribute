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
    // console.log(self.callApi());
    return {
      message: '',
      current: 'reply',
      messages: [],
      editorInstance: null,
      config: {
        events: {
          initialized: async function() {
            var editor = this;
            self.editorInstance = this;
            let tribute1 = await self.callApi();
            tribute1.attach(editor.el);

            editor.events.on('keydown', function(e) {
              if (e.which == FroalaEditor.KEYCODE.ENTER && tribute1.isActive) {
                return false;
              }
            }, true);
          },
          focus: async function() {
            var editor = this;
            console.log("cre")
            let tribute1 = await self.callApi();
            let tribute2 = await self.callApi1();
            if(self.current == 'note') {
              tribute1.detach(editor.el);
              tribute2.attach(editor.el);

              editor.events.on('keydown', function(e) {
                if (e.which == FroalaEditor.KEYCODE.ENTER && tribute2.isActive) {
                  return false;
                }
              }, true);
            } else {
              tribute2.detach(editor.el)
              tribute1.attach(editor.el);

              editor.events.on('keydown', function(e) {
                if (e.which == FroalaEditor.KEYCODE.ENTER && tribute1.isActive) {
                  return false;
                }
              }, true);
            }
          }
        },
        placeholderText: "Edit Your Reply Here!",
        charCounterCount: false,
        toolbarButtons: [['bold', 'italic', 'underline', 'strikeThrough', 'insertHR'], ['my_dropdown', 'clear', 'insert'], ['undo', 'redo', 'selectAll']],
      },
    };
  },
  methods: {
    async callApi() {
      console.log("calling api");
      const response = await fetch("http://localhost/mas/hw/tmhw.php");
      const data = await response.json();
      console.log(data);
      return this.createTribute(data);
    },
    async callApi1() {
      console.log("calling api");
      const response = await fetch("http://localhost/mas/hw/tmhw.php");
      const data = await response.json();
      console.log(data);
      return this.createTribute1(data);
    },
    createTribute(data) {
      console.log("creating tribute");
      console.log(this.editorInstance);
        var tribute = new Tribute({
          trigger: '#',
          values: data,
          lookup: 'username',
          fillAttr: 'firstname',
          selectTemplate: function(item) {
            return `<span contenteditable="false" class="mention-h fr-deletable fr-tribute">#` + item.original.firstname + "</span>"
          },
          noMatchTemplate: function () {
            return '<span style:"visibility: hidden;"></span>';
          },
        });
      return tribute;
    },
    createTribute1(data) {
      console.log("creating tribute");
        var tribute = new Tribute({
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
              values: data,
              lookup: 'username',
              fillAttr: 'firstname',
              selectTemplate: function(item) {
                return `<span contenteditable="false" class="mention-h fr-deletable fr-tribute">#` + item.original.firstname + "</span>"
              },
              noMatchTemplate: function () {
                return '<span style:"visibility: hidden;"></span>';
              }
            }
          ]
        });
      return tribute;
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
    min-height: 400px;
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