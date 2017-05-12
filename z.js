                menus.forEach(function foreach(...props) {
                    const prefix = typeof props[0] === 'string' ? props[0] : '',
                        menu = prefix !== '' ? props[1] : props[0];

                    const {id, name} = menu;
                    _parentMenuList.push({id, name: prefix + name});

                    if(id == self.menu.parent_id){
                        self.parentMenu = { id, name: prefix + name }
                    }

                    if(menu.children && menu.children.length > 0){
                        // menu.children.forEach(foreach.bind(this, prefix + '|----'));
                        menu.children.forEach(foreach.bind(this, prefix + name + '--'));
                    }
                });
