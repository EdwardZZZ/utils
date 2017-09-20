<template>
    <div class="pagenation" v-if="count > 1">
        <ol>
            <li class="angel_left" @click="goPage(NO-1)">《</li>
            <template v-if="type === 1">
                <template v-if="count < 9">
                    <li v-for="n in count" :class="[{'act': n === NO}]">{{n}}</li>
                </template>
                <template v-else>
                    <li @click="goPage(1)" v-if="NO > 2" :class="[{'act': NO === 1}]">1</li>
                    <li v-if="NO > 3">...</li>
                    <li @click="goPage(n)" v-for="n in [NO-1, NO, NO+1]" v-if="n <= count && n > 0" :class="[{'act': n === NO}]">{{n}}</li>
                    <li v-if="NO < count-2">...</li>
                    <li @click="goPage(count)" v-if="NO < count-1" :class="[{'act': NO === count}]">{{count}}</li>
                </template>
            </template>
            <template v-else>
                <li>{{NO}}
                    <select class="li-select" @change="change">
                        <option v-for="n in count">{{n}}</option>
                    </select>
                </li>
            </template>
            <li class="angel_right" @click="goPage(NO+1)">》</li>
        </ol>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
        };
    },
    props: {
        NO: { // 页码
            type: Number,
            default: 1,
        },
        size: { // 每页条数
            type: Number,
            default: 10,
        },
        total: { // 总条数
            type: Number,
            required: true,
        },
        type: {
            type: Number,
            default: 1,
        },
    },
    watch: {
        size() {
            this.setCount();
        },
        total() {
            this.setCount();
        },
    },
    methods: {
        setCount() {
            const { size, total } = this;
            this.count = (total % size ? 1 : 0) + parseInt(total / size);
        },
        change(e) {
            this.$emit('onPage', +e.target.value);
        },
        goPage(n) {
            if (n < 1 || n > this.count) return;
            this.$emit('onPage', n);
        },
    },
    mounted() {
        this.setCount();
    },
};
</script>

<style lang="scss">
    .pagenation {
        margin-top: 20px;
        li {
            float: left;
            cursor: pointer;
            padding: 6px 14px;
            margin-left: -1px;
            color: #337ab7;
            background: #fff;
            border: 1px solid #ddd;
            position: relative;
            .li-select{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                font-size: 16px;
            }
        }
        .act {
            background: #337ab7;
            border-color: #337ab7;
            color: #fff;
        }
        .angel_left {
            margin-left: 0px;
            border-radius: 4px 0 0 4px;
        }
        .angel_right {
            border-radius: 0 4px 4px 0;
        }
    }
</style>
