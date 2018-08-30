Vue.component('crypto-icon', {
    props: ['symbol'],
    template: '<i class="cc" :class="symbol"></i>'
});

var mainStats = new Vue({
    el: '#main-stats',
    data: {
        coins: [],
        loading: true,
        sortColumns: {},
        activeColumn: null
    },
    methods: {
        getData: function () {
            vm = this
            axios.get('https://api.coinmarketcap.com/v2/ticker/?limit=12')
            .then(function (response) {
                vm.coins = [];
                var data = response.data.data;
                for (var prop in data) {
                    if ( data.hasOwnProperty(prop) ) {
                        var temp = data[prop]['quotes']['USD']
                        delete data[prop]['quotes']

                        vm.coins.push(Object.assign(data[prop], temp))
                    }
                }
                vm.loading = false;
            })
            .catch(function (error) {
                console.log(error)
            })
            
        },
        updateTable: function () {
            this.loading = true;
            this.getData()
        },
        sortBy: function (field) {
            if (this.sortColumns[field] === undefined) {
                this.sortColumns[field] = false;
            }
            this.activeColumn = field;
            if (!this.sortColumns[field]) {
                this.coins = this.coins.sort(function(item1, item2) {
                    if(item1[field] < item2[field]) return -1;
                    if(item1[field] > item2[field]) return 1;
                    return 0;
                });
                this.sortColumns[field] = true;
            } else {
                this.coins = this.coins.sort(function(item1, item2) {
                    if(item1[field] > item2[field]) return -1;
                    if(item1[field] < item2[field]) return 1;
                    return 0;
                });
                this.sortColumns[field] = false;
            }
                
        },
        isGrowing: function (num) {
            return num > 0;
        },
        isActive: function (column) {
            return this.activeColumn == column;
        }
    },
    created() {
        this.getData()
    },
})