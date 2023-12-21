<script lang="ts">
	import type { CatType, ItemType } from './types.ts';
	import Cat from './Cat.svelte';
	import { onMount } from 'svelte';

	const colors: string[] = [
		'106, 167, 85', // green
		'139, 117, 228', // purple
		'250, 113, 106', // red
		'71, 134, 206', // blue
		'243, 180, 81', // yellow
	]

	let categories: CatType[] = [
		{
			name: '',
			weight: 0,
			color: colors[0],
			items: [
				{pts: 0, total: 0, star: false}
			]
		}
	]
	let starred: boolean = false;
	let starredItem: ItemType;
	let starredCat: CatType;
	let starNeeded: number;
	let starGoal: number = 90;
	
	$: totalWeight = categories.reduce((acc, cat) => acc + cat.weight, 0);
	$: finalGrade = categories.reduce((acc, cat) => acc + (cat.weight / totalWeight) * 
		((cat.items.reduce((acc, item) => acc + item.pts, 0) / cat.items.reduce((acc, item) => acc + item.total, 0)) || 0)
	, 0);

	$: if (starred) {
		let nonStarCatSum = categories.reduce((acc, cat) => {
			if (cat !== starredCat) {
				return acc + (cat.weight / totalWeight) * 
					((cat.items.reduce((acc, item) => acc + item.pts, 0) / cat.items.reduce((acc, item) => acc + item.total, 0)) || 0)
			} else {
				return acc
			}
		}, 0);
		let starCatTotalSum = starredCat.items.reduce((acc, item) => acc + item.total, 0);
		let starCatPtsRemainderSum = starredCat.items.reduce((acc, item) => 
			item !== starredItem ? acc + item.pts : acc, 
		0);
		starNeeded = (((starGoal / 100 - nonStarCatSum) * starCatTotalSum) / (starredCat.weight / totalWeight)) - starCatPtsRemainderSum;
	}

	$: if (starred) {
		categories.forEach(c => {
			c.items.forEach(i => {
				if (i.star) {
					starredItem = i;
					starredCat = c;
				}
			})
		})
	}

	function addCat () {
		categories = [...categories, {
			name: '',
			weight: 0.00,
			color: colors[categories.length % colors.length],
			items: [
				{pts: 0, total: 0, star: false}
			]
		}];
	}

	function removeCat (catData: CatType) {
		if (categories.length > 1) {
			categories = categories.filter(c => c != catData);
		}
	}

	function starItem (catData: CatType, item: ItemType) {
		categories.forEach(c => {
			c.items.forEach(i => {
				if (i === item) {
					i.star = !i.star;
					starred = i.star;
				} else {
					i.star = false;
				}
			})
		})
		categories = categories
	}

	onMount(() => {
		for (let i = colors.length - 1; i > 0; i--) { 
			const j = Math.floor(Math.random() * (i + 1)); 
			[colors[i], colors[j]] = [colors[j], colors[i]]; 
		}
		categories[0].color = colors[0];
	})
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
	<h1 class="text-3xl py-8">what do i need on my final.com</h1>
	<div class="flex flex-row">
		<div class="cats-container">
			{#each categories as catData}
				<Cat bind:catData={catData} {removeCat} {starItem}/>
			{/each}
			<button class="bg-gray-200 flex justify-center items-center w-8 h-24 rounded-md"
				on:click={addCat}
			>
				+
			</button>
		</div>
	</div>
	<div class="results">
		{#if totalWeight != 100}
			<div class="weight-warning">
				<p>⚠️ Total weight is {totalWeight > 100 ? " greater than 100%" : " less than 100%"}. {totalWeight == 0 ? "Add percentage weighted for each category." : "Weights were adjusted to total 100%."}</p>
			</div>
		{/if}

		<p class="text-3xl">Final Grade: {(100 * finalGrade || 0).toFixed(2).replace(/[.,]00$/, "")}%</p>
		
		{#if starred}
			<p class="text-2xl">You need a {(starNeeded || 0).toFixed(2).replace(/[.,]00$/, "")}/{starredItem.total} ({((100 * starNeeded / starredItem.total) || 0).toFixed(2).replace(/[.,]00$/, "")}%) on ★ to get a 
				<input class="star-goal-input border-gray-400" 
					type="number" min="0" max="100" step="1"
					bind:value={starGoal}
				>
			%.</p>
		{:else}
			<p class="text-2xl">★ an item to see how it'll affect your grade.</p>
		{/if}
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		padding: 0 2rem 0 2rem;
	}
	.cats-container {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;
	}
	.results {
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		padding: 2rem 0 2rem 0;
		background-color: white;
	}
	.weight-warning {
		padding: 1rem;
		background-color: #fde68a;
		border-radius: 0.5rem;
	}
	.star-goal-input {
		min-width: 0;
		width: 4rem;
		text-align: center;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		border: 2px solid #b8bfcc;
	}
</style>
