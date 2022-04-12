const data = require('./data.js');
const events = require('./events.js');
const classes = require('./classes.js');

const customSelect = {
	buildSelectProjects: function() {
		projLists = document.querySelector('.custom-select');
		projLists.innerHTML = '';
		let select = document.createElement('select');
			select.id = 'projects';
		let activeProject = 0;
		data.getProjects().map((item, ind) => {
			if(ind == 0) {
				if(data.getDataUser.getProject() == undefined) {
					data.setDataUser.setProject(item.pid);
				}
			}
			let option = document.createElement('option');
				option.dataset.pid = item.pid;
				option.innerHTML = item.name;
				if(ind == 0) {
					option.setAttribute.selected = true
				}
			if(data.getDataUser.getProject() == item.pid) {
				activeProject = ind
			}
			select.appendChild(option)
		})
		select.selectedIndex = activeProject;
		projLists.appendChild(select)
		customSelect.initSelect();
	},
	initSelect: function() {
		var x, i, j, l, ll, selElmnt, a, b, c;

		x = document.getElementsByClassName("custom-select");
		l = x.length;

		for (i = 0; i < l; i++) {
		    selElmnt = x[i].getElementsByTagName("select")[0];
		    ll = selElmnt.length;

		    a = document.createElement("DIV");
		    a.setAttribute("class", "select-selected");
		    a.innerHTML = '<span>'+selElmnt.options[selElmnt.selectedIndex].innerHTML+'</span>';
		    x[i].appendChild(a);

		    b = document.createElement("DIV");
		    b.setAttribute("class", "select-items select-hide");
		    for (j = 0; j < ll; j++) {
		        c = document.createElement("DIV");
		        c.innerHTML = selElmnt.options[j].innerHTML;
		        c.addEventListener("click", function(e) {
		            var y, i, k, s, h, sl, yl;
		            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
		            sl = s.length;
		            h = this.parentNode.previousSibling;
		            for (i = 0; i < sl; i++) {
		                if (s.options[i].innerHTML == this.innerHTML) {
		                    s.selectedIndex = i;
		                    h.innerHTML = '<span>'+this.innerHTML+'</span>';
		                    y = this.parentNode.getElementsByClassName("same-as-selected");
		                    yl = y.length;
		                    for (k = 0; k < yl; k++) {
		                        y[k].removeAttribute("class");
		                    }
		                    this.setAttribute("class", "same-as-selected");
		                    break;
		                }
		            }
		            classes.preloader(true, 'Обновляю данные...');
		            data.setDataUser.setProject(selElmnt.options[selElmnt.selectedIndex].dataset.pid);
		            events.loadProjectData();
		            classes.setIndexes();
		            h.click();
		        });
		        b.appendChild(c);
		    }
		    x[i].appendChild(b);

		    a.addEventListener("click", function(e) {
		        e.stopPropagation();
		        customSelect.closeAllSelect(this);
		        this.nextSibling.classList.toggle("select-hide");
		        this.classList.toggle("select-arrow-active");
		    });
		}
	},
	closeAllSelect: function(elmnt) {
	    var x, y, i, xl, yl, arrNo = [];
	    x = document.getElementsByClassName("select-items");
	    y = document.getElementsByClassName("select-selected");
	    xl = x.length;
	    yl = y.length;
	    for (i = 0; i < yl; i++) {
	        if (elmnt == y[i]) {
	            arrNo.push(i)
	        } else {
	            y[i].classList.remove("select-arrow-active");
	        }
	    }
	    for (i = 0; i < xl; i++) {
	        if (arrNo.indexOf(i)) {
	            x[i].classList.add("select-hide");
	        }
	    }
	}
}


module.exports = customSelect;