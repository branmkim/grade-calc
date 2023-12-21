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
	let id = 1;

	let categories: CatType[] = []
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
			color: colors[id % colors.length],
			id: ++id,
			weight: 0.00,
			items: [
				{id: 1, pts: 0, total: 0, star: false}
			]
		}];
	}

	function removeCat (catData: CatType) {
		if (categories.length > 1) {
			if (catData.items.some(i => i.star)) deleteStar();
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

	function deleteStar () {
		starred = false;
	}

	onMount(() => {
		for (let i = colors.length - 1; i > 0; i--) { 
			const j = Math.floor(Math.random() * (i + 1)); 
			[colors[i], colors[j]] = [colors[j], colors[i]]; 
		}
		categories = [...categories, {
			name: '',
			color: colors[id % colors.length],
			id: ++id,
			weight: 100,
			items: [
				{id: 1, pts: 0, total: 0, star: false}
			]
		}];
	})
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Unna:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</svelte:head>

<main>
	<h1 class="text-3xl font-bold py-8">what do i need on my final.com</h1>
	<div class="flex flex-row">
		<div class="cats-container">
			{#each categories as catData (catData.id)}
				<Cat bind:catData={catData} {removeCat} {starItem} {deleteStar}/>
			{/each}
			<button class="bg-gray-200 flex justify-center items-center w-8 max-h-full min-h-16 rounded-md"
				on:click={addCat}
			>
				+
			</button>
		</div>
	</div>
	<div class="results">
		{#if totalWeight != 100}
			<div class="weight-warning">
				<p>⚠️ Total weight is {totalWeight > 100 ? " greater than 100%" : " less than 100%"}. {totalWeight == 0 ? "Add percentage weighted for each category." : "Weights were scaled to total 100%."}</p>
			</div>
		{/if}

		<p class="text-3xl font-bold">Overall grade: {(100 * finalGrade || 0).toFixed(2).replace(/[.,]00$/, "")}%</p>
		
		{#if starred}
			<p class="text-2xl">You need a {(starNeeded || 0).toFixed(2).replace(/[.,]00$/, "")}/{starredItem.total} ({((100 * starNeeded / starredItem.total) || 0).toFixed(2).replace(/[.,]00$/, "")}%) on ★ to get a 
				<input class="star-goal-input border-gray-400" 
					type="number" min="0" max="100" step="1"
					bind:value={starGoal}
				>
			%.</p>
			<div class="-mt-4">
				{#if starNeeded / starredItem.total > 1}
					<p class="text-red-500">bro ur so cooked 💀</p>
				{:else if starNeeded / starredItem.total > 0.9}
					<p class="text-orange-400">the dream is alive!! 😸</p>
				{:else if starNeeded / starredItem.total > 0.8}
					<p class="text-emerald-600">i believe 🙏</p>
				{:else if starNeeded / starredItem.total > 0.7}
					<p class="text-blue-400">u got this 👍</p>
				{:else}
					<p class="text-purple-500">jus chillin 🦦</p>
				{/if}
			</div>
		{:else}
			<p class="text-2xl">★ an item to see how it'll affect your grade.</p>
		{/if}
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');
	main {
		display: flex;
		flex-direction: column;
		margin: 0 2rem;
		font-family: 'Public Sans', sans-serif;
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
		width: 100%;
		padding-top: 1rem;
		padding-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
