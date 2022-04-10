Vue.createApp({
  methods: {
    inputlink(ev) {
      const link = ev.target.value;

      document.location.href = `/?user=${link}`;
    },
  },
  data() {
    return {
      message: "Hello Vue!",
      users: [],
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
          user.avatar = response.avatar.small.permalink;
          user.name = response.name;
          user.username = response.username;
          //delete user["response"]
        });
        this.users = users.sort((a, b) => b.likes - a.likes);
      })
    );
  },
}).mount("#app");
