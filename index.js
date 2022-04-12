Vue.createApp({
  methods: {
    inputlink(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      const link = (ev.clipboardData || window.clipboardData).getData("text");

      if (link.match(/^https:\/\/disqus.com\/by/)) {
        document.location.href = `/?user=${link}`;
      } else {
        window.alert("Nem néz ki felhasználói profil linknek!");
      }
    },
    searchinput(ev) {
      const term = ev.target.value;

      this.term = term;
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
