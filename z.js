                menus.forEach(function foreach(...props) {
                    let {id, name, children} = props[0];
                    
                    if(id != self.menu.id){
                        name = this + name;
                        _parentMenuList.push({id, name});

                        if(children && children.length > 0){
                            children.forEach(foreach.bind(name + '--'));
                        }
                    }
                }.bind(''));
