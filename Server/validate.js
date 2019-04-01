user = (username) => {
    if(!username){
        return {error: 'Undefined username'};
    } else if(username.length > 20) {
        return {error: 'Maximum lenght for username is 20 characters'};
    } else if(username.includes(';') || username.includes('<') || username.includes('>')){
        return {error: 'No hacking please :)'};
    } else {
        return {username: username};
    }
}

group = (groupname, groups) => {
    if(!groupname) {
        return {error: "Undefined groupname"}
    } else if(groupname.length > 20) {
        return {error: "Maximum lenght for groupname is 20 characters"}
    } else if (groupname.includes(';') || groupname.includes('<') || groupname.includes('>')){
        return {error: "No hack plz :)"}
    } else if(groups.includes(groupname.toLowerCase())) {
        return {error: "Groupname already in use"}
    }  else {
        return {groupname: groupname};
    } 
}

module.exports = {
    user,
    group
}