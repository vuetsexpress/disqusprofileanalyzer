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
        this.users = users;
      })
    );
  },
}).mount("#app");
