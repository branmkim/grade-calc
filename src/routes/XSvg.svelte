<script lang="ts">
    export let color: string;
</script>

<svg width="100%" height="100%" viewBox="0 0 40 40">
    <line x1="5" y1="5" x2="35" y2="35" stroke="rgba({color})" stroke-width="8"/>
    <line x1="35" y1="5" x2="5" y2="35" stroke="rgba({color})" stroke-width="8"/>
</svg>