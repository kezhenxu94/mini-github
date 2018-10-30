const formatItem = (event) => {
  const {
    type, actor: {
      name: display_login, avatar: avatar_url
    }
  } = event
  console.log('%o, %o, %o, %o', type, actor, actor.name, actor.avatar)
  return 'abv'
}