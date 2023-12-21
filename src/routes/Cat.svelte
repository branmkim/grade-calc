<script lang="ts">
    import type { CatType, ItemType } from './types.js';
    import XSvg from './XSvg.svelte';
    import StarSvg from './StarSvg.svelte';
	import { fly } from 'svelte/transition';

    export let catData: CatType;
    export let removeCat: (catData: CatType) => void;
    export let starItem: (catData: CatType, item: ItemType) => void;
    export let deleteStar: () => void;

    let id = 1;

    function addItem () {
        catData.items = [...catData.items, { 
            id: ++id, 
            pts: 0, 
            total: 0, 
            star: false 
        }]
    }

    function deleteItem (item: ItemType) {
        if (catData.items.length > 1) {
            if (item.star) deleteStar();
            catData.items = catData.items.filter(i => i !== item)
        }
    }
</script>

<div class="cat-container"
    style="--color: {catData.color}"
    in:fly={{duration: 250, x: -20, opacity: 0}}
    out:fly={{duration: 250, y: -20, opacity: 0}}
>
    <div class="inputs-row items-start">
        <div class="flex flex-col flex-1" style="flex-grow: 2">
            <p class="text-xs pb-1">Category</p>
            <input class="input-field bordered text-black" 
                type="text" placeholder="Name" 
                bind:value={catData.name}
            />
        </div>
        <div class="flex flex-col flex-1">
            <p class="text-xs pb-1">Weight (%)</p>
            <input class="input-field bordered" type="number" placeholder="Weight" 
                min="0" max="100" step="1"
                bind:value={catData.weight}
            />
        </div>
        <button class="x-button"
            on:click={() => removeCat(catData)}
        >
            <XSvg color={catData.color} />
        </button>
    </div>
    <div class="inputs-row -mb-2">
        <!-- spacers -->
        <p class="x-button"></p>
        <p class="star-button"></p>
        <p class="flex-1 text-xs text-right">Points</p>
        <p class="w-2 text-xs"></p>
        <p class="flex-1 text-xs">Total</p>
    </div>
    <div class="flex flex-col gap-0">
        {#each catData.items as item (item.id)}
            <div transition:fly={{duration: 250, y: -10}} class="inputs-row items-center">
                <button class="x-button"
                    on:click={() => deleteItem(item)}
                >
                    <XSvg color={catData.color} />
                </button>
                <button class="star-button"
                    on:click={() => starItem(catData, item)}
                >
                    <StarSvg color={catData.color} filled={item.star} />
                </button>
                <input class="input-field text-right" type="number" placeholder="pts" 
                    bind:value={item.pts}
                />
                <p class="mb-1">/</p>
                <input class="input-field" type="number" placeholder="total"
                    bind:value={item.total}
                />
            </div>
        {/each}
    </div>
    <p class="text-xs">Overall: {
        ((100 * catData.items.reduce((acc, item) => acc + item.pts, 0) / catData.items.reduce((acc, item) => acc + item.total, 0)) || 0)
        .toFixed(2).replace(/[.,]00$/, "")}%
    </p>
    <div>
        <button class="add-button"
            on:click={addItem}
        >
            Add
        </button>
    </div>
</div>

<style>
    /* your styles go here */
    
    .cat-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: fit-content;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: rgba(var(--color), 0.2);
    }
    .x-button, .star-button {
        width: 1rem;
    }
    .inputs-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 0.5rem;
    }
    .inputs-row > * {
        min-width: 0;
    }
    .input-field {
        box-sizing: border-box;
        flex: 1 1 0%;
        min-width: 0;
        padding: 0.25rem;
        border-radius: 0.375rem;
        background-color: rgba(255, 255, 255, 0);
        border: 2px solid rgba(0, 0, 0, 0);
    }
    .input-field:focus {
        outline: none;
        background-color: rgba(255, 255, 255, 0.5);
        border-color: rgba(var(--color));
    }
    .add-button {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: rgba(var(--color));
    }
    .bordered {
        border: 2px solid rgba(var(--color));
    }
</style>

<!-- markup (zero or more items) goes here -->