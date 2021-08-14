<template>
    <div>Test!!</div>
</template>

<script>
@Component
class Example extends Vue {
    public mounted(): void {
        const test = 'test';
        console.log(test)
    }
}
</script>