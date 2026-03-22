<script>
	import DownloadPdfButton from '$lib/components/resume/download-pdf-button.svelte';
	import { formatDateRange, formatYearRange, published } from '$lib/utils/resume-helpers.js';

	let { data } = $props();
	let meta = $derived(data.meta);
</script>

<main class="resume-page py-12 md:py-20">
	<!-- Header — editorial hero -->
	<header class="mb-16 md:mb-24">
		<div class="mb-6 flex items-center gap-3">
			<div class="h-px w-8 bg-neutral-400 dark:bg-neutral-500"></div>
			<span
				class="text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500"
			>
				About
			</span>
		</div>
		<h1
			class="text-5xl leading-[0.95] font-extralight tracking-tight text-neutral-900 md:text-7xl lg:text-8xl dark:text-neutral-100"
		>
			{meta.title}
		</h1>
		{#if meta.summary}
			<p
				class="mt-8 max-w-2xl text-base leading-relaxed! text-neutral-500 md:mt-10 md:text-lg dark:text-neutral-400"
			>
				{meta.summary}
			</p>
		{/if}
		<nav class="mt-8 flex flex-wrap items-center gap-4">
			{#if meta.links?.length}
				{#each meta.links as link}
					<a
						href={link.url}
						class="group/link inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors duration-300 hover:text-neutral-900 hover:no-underline dark:text-neutral-400 dark:hover:text-neutral-100"
					>
						<span class="group-hover/link:underline">{link.title}</span>
						<span
							class="text-xs opacity-50 transition-opacity duration-300 group-hover/link:opacity-100"
							>↗</span
						>
					</a>
				{/each}
			{/if}
			<DownloadPdfButton {meta} />
		</nav>
	</header>

	<!-- Experience — timeline layout -->
	{#if meta.experience?.publish && meta.experience.content?.length}
		<section class="mb-16 md:mb-24">
			<div class="mb-10 flex items-baseline gap-4 md:mb-14">
				<h2
					class="text-3xl font-extralight tracking-tight text-neutral-300 md:text-4xl dark:text-neutral-700"
				>
					Experience
				</h2>
				<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="space-y-12 md:space-y-16">
				{#each published(meta.experience.content) as job, i}
					<div
						class="group grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px] md:gap-10"
						style="animation: fadeSlideUp 0.5s ease-out {i * 0.1}s both"
					>
						<!-- Content -->
						<div class="min-w-0">
							<h3
								class="text-xl font-medium tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-100"
							>
								{job.title}
							</h3>
							<p class="mt-1 text-base! font-light text-neutral-500 dark:text-neutral-400">
								{job.company}
							</p>
							{#if job.works?.length}
								<ul class="mt-4 space-y-2.5">
									{#each job.works as work}
										<li
											class="relative pl-5 text-sm! leading-relaxed! text-neutral-600 before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-1.5 before:bg-neutral-300 before:content-[''] dark:text-neutral-400 dark:before:bg-neutral-600"
										>
											{work}
										</li>
									{/each}
								</ul>
							{/if}
							{#if job.projectGroups?.length}
								<div class="mt-5 space-y-5">
									{#each job.projectGroups as group}
										<div
											class="border-l-0 pl-0 md:border-l md:border-neutral-200 md:pl-4 dark:md:border-neutral-800"
										>
											<h4
												class="text-sm font-semibold tracking-wide text-neutral-700 uppercase md:pl-4 dark:text-neutral-300"
											>
												{group.name}
											</h4>
											{#if group.works?.length}
												<ul class="mt-2.5 space-y-2.5 md:pl-4">
													{#each group.works as work}
														<li
															class="relative pl-5 text-sm! leading-relaxed! text-neutral-600 before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-1.5 before:bg-neutral-300 before:content-[''] dark:text-neutral-400 dark:before:bg-neutral-600"
														>
															{work}
														</li>
													{/each}
												</ul>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Date column — right side -->
						<div class="order-first md:order-last md:pt-1 md:text-right">
							<div class="text-sm font-medium text-neutral-900 tabular-nums dark:text-neutral-100">
								{formatDateRange(job.startTime, job.endTime)}
							</div>
							<div class="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
								{job.location}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Education -->
	{#if meta.education?.publish && meta.education.content?.length}
		<section class="mb-16 md:mb-24">
			<div class="mb-10 flex items-baseline gap-4 md:mb-14">
				<h2
					class="text-3xl font-extralight tracking-tight text-neutral-300 md:text-4xl dark:text-neutral-700"
				>
					Education
				</h2>
				<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="space-y-8">
				{#each published(meta.education.content) as edu, i}
					<div
						class="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px] md:gap-10"
						style="animation: fadeSlideUp 0.5s ease-out {i * 0.1}s both"
					>
						<div>
							<h3
								class="text-lg font-medium tracking-tight text-neutral-900 md:text-xl dark:text-neutral-100"
							>
								{edu.title}
							</h3>
							<p class="mt-1 text-base! font-light text-neutral-500 dark:text-neutral-400">
								{edu.institute} · {edu.location}
							</p>
							{#if edu.works?.length}
								{#each edu.works as work}
									<p class="mt-2 text-sm! text-neutral-500 dark:text-neutral-400">
										{work}
									</p>
								{/each}
							{/if}
							{#if edu.courseworks?.length}
								<p class="mt-2 text-sm! text-neutral-500 dark:text-neutral-400">
									Relevant coursework: {edu.courseworks.join(', ')}
								</p>
							{/if}
						</div>
						<div class="order-first md:order-last md:pt-1 md:text-right">
							<div class="text-sm font-medium text-neutral-900 tabular-nums dark:text-neutral-100">
								{formatYearRange(edu.startTime, edu.endTime)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Skills — structured grid -->
	{#if meta.skills?.publish && meta.skills.content?.length}
		<section class="mb-16 md:mb-24">
			<div class="mb-10 flex items-baseline gap-4 md:mb-14">
				<h2
					class="text-3xl font-extralight tracking-tight text-neutral-300 md:text-4xl dark:text-neutral-700"
				>
					Skills
				</h2>
				<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
				{#each published(meta.skills.content) as skill, i}
					<div style="animation: fadeSlideUp 0.4s ease-out {i * 0.08}s both">
						<h3
							class="mb-3 text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase dark:text-neutral-500"
						>
							{skill.title}
						</h3>
						{#if skill.description}
							<div class="flex flex-wrap gap-1.5">
								{#each skill.description.split(', ') as tag}
									<span
										class="inline-block rounded-sm border border-neutral-200/60 bg-neutral-100 px-3 py-1.5 text-sm font-light text-neutral-700 transition-colors duration-200 hover:border-neutral-300 dark:border-neutral-700/40 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:border-neutral-600"
									>
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Interests -->
	{#if meta.interests?.publish && meta.interests.content?.length}
		<section class="mb-16 md:mb-24">
			<div class="mb-10 flex items-baseline gap-4 md:mb-14">
				<h2
					class="text-3xl font-extralight tracking-tight text-neutral-300 md:text-4xl dark:text-neutral-700"
				>
					Interests
				</h2>
				<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="flex flex-wrap gap-3">
				{#each published(meta.interests.content) as interest, i}
					<span
						class="inline-block rounded-sm border border-neutral-200 px-4 py-2 text-sm font-light text-neutral-600 transition-all duration-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200"
						style="animation: fadeSlideUp 0.4s ease-out {i * 0.06}s both"
					>
						{interest.title}
					</span>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	@keyframes fadeSlideUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
