Vue.createApp({
  methods: {
    top20clicked(ev) {
      ev.target.focus();
      ev.target.select();
      document.execCommand("copy");
    },
    clickuser(ev, user) {
      if (ev.ctrlKey) {
        document.location.href = `/?deluser=${user._id}`;
      }
    },
    pastelink(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      const link = (ev.clipboardData || window.clipboardData).getData("text");

      if (link.match(/^https:\/\/disqus.com\/by/)) {
        document.location.href = `/?user=${link}`;
      } else {
        window.alert("Nem néz ki felhasználói profil linknek!");
      }
    },
    inputlink(ev) {
      ev.target.value = "";
      window.alert("Begépeléssel nem működik. Be kell szúrni!");
    },
    searchinput(ev) {
      const term = ev.target.value;

      this.term = term;
    },
  },
  computed: {
    top20() {
      return `Lájkverseny Top 20 : ${this.users
        .slice(0, 20)
        .map(
          (user, i) =>
            `${i + 1}. ${user.name} ${Math.round(user.lr * 100) / 100}`
        )
        .join(" , ")}`;
    },
  },
  data() {
    return {
      message: "Hello Vue!",
      users: [],
      term: "",
    };
  },
  mounted() {
    console.log("mounted");
    fetch("/users").then((resp) =>
      resp.json().then((users) => {
        console.log(users);
        users.forEach((user) => {
          const response = user.response;
          user.likes = response.numLikesReceived;
          user.posts = response.numPosts;
          user.lr = user.likes / (user.posts || 1);
          user.avatar = response.avatar.small.permalink;
          user.name = response.name;
          user.username = response.username;
          //delete user["response"]
        });
        this.users = users.sort((a, b) => b.lr - a.lr);
      })
    );
  },
}).mount("#app");
