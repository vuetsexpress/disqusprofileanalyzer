Vue.createApp({
  methods: {
    inputlink(ev) {
      const link = ev.target.value;

      document.location.href = `/?user=${link}`;
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
