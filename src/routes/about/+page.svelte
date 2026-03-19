<script>
	let { data } = $props();
	let meta = $derived(data.meta);

	/**
	 * @param {string} dateStr
	 */
	function formatDate(dateStr) {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatDateRange(startTime, endTime) {
		const start = formatDate(startTime);
		const end = endTime ? formatDate(endTime) : 'Present';
		return `${start} — ${end}`;
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatYearRange(startTime, endTime) {
		const startYear = new Date(startTime).getFullYear();
		const endYear = endTime ? new Date(endTime).getFullYear() : undefined;
		if (endYear && endYear !== startYear) {
			return `${startYear} — ${endYear}`;
		}
		return `${startYear}`;
	}

	/**
	 * @template {Record<string, any> & {publish: boolean}} T
	 * @param {T[]} items
	 * @returns {T[]}
	 */
	function published(items) {
		return items.filter((item) => item.publish);
	}
</script>

<main class="resume-page py-12 md:py-20">
	<!-- Header — editorial hero -->
	<header class="mb-16 md:mb-24">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-8 h-px bg-neutral-400 dark:bg-neutral-500"></div>
			<span class="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">About</span>
		</div>
		<h1 class="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-neutral-900 dark:text-neutral-100 leading-[0.95]">
			{meta.title}
		</h1>
		{#if meta.summary}
			<p class="mt-8 md:mt-10 text-base md:text-lg !leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-2xl">
				{meta.summary}
			</p>
		{/if}
		{#if meta.links?.length}
			<nav class="mt-8 flex flex-wrap gap-4">
				{#each meta.links as link}
					<a
						href={link.url}
						class="group/link inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300 hover:no-underline"
					>
						<span class="group-hover/link:underline">{link.title}</span>
						<span class="text-xs opacity-50 group-hover/link:opacity-100 transition-opacity duration-300">↗</span>
					</a>
				{/each}
			</nav>
		{/if}
	</header>

	<!-- Experience — timeline layout -->
	{#if meta.experience?.publish && meta.experience.content?.length}
		<section class="mb-16 md:mb-24">
			<div class="flex items-baseline gap-4 mb-10 md:mb-14">
				<h2 class="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-300 dark:text-neutral-700">
					Experience
				</h2>
				<div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="space-y-12 md:space-y-16">
				{#each published(meta.experience.content) as job, i}
					<div class="group grid grid-cols-1 md:grid-cols-[1fr_180px] gap-2 md:gap-10"
						style="animation: fadeSlideUp 0.5s ease-out {i * 0.1}s both"
					>
						<!-- Content -->
						<div class="min-w-0">
							<h3 class="text-xl md:text-2xl font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
								{job.title}
							</h3>
							<p class="!text-base text-neutral-500 dark:text-neutral-400 mt-1 font-light">
								{job.company}
							</p>
							{#if job.works?.length}
								<ul class="mt-4 space-y-2.5">
									{#each job.works as work}
										<li class="!text-sm !leading-relaxed text-neutral-600 dark:text-neutral-400 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-neutral-300 dark:before:bg-neutral-600">
											{work}
										</li>
									{/each}
								</ul>
							{/if}
							{#if job.projectGroups?.length}
								<div class="mt-5 space-y-5">
									{#each job.projectGroups as group}
										<div class="pl-0 md:pl-4 border-l-0 md:border-l md:border-neutral-200 dark:md:border-neutral-800">
											<h4 class="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300 md:pl-4">
												{group.name}
											</h4>
											{#if group.works?.length}
												<ul class="mt-2.5 space-y-2.5 md:pl-4">
													{#each group.works as work}
														<li class="!text-sm !leading-relaxed text-neutral-600 dark:text-neutral-400 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-neutral-300 dark:before:bg-neutral-600">
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
						<div class="md:text-right md:pt-1 order-first md:order-last">
							<div class="text-sm font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
								{formatDateRange(job.startTime, job.endTime)}
							</div>
							<div class="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
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
			<div class="flex items-baseline gap-4 mb-10 md:mb-14">
				<h2 class="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-300 dark:text-neutral-700">
					Education
				</h2>
				<div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="space-y-8">
				{#each published(meta.education.content) as edu, i}
					<div class="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-2 md:gap-10"
						style="animation: fadeSlideUp 0.5s ease-out {i * 0.1}s both"
					>
						<div>
							<h3 class="text-lg md:text-xl font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
								{edu.title}
							</h3>
							<p class="!text-base text-neutral-500 dark:text-neutral-400 mt-1 font-light">
								{edu.institute} · {edu.location}
							</p>
							{#if edu.works?.length}
								<ul class="mt-3 space-y-1.5">
									{#each edu.works as work}
										<li class="!text-sm text-neutral-500 dark:text-neutral-400 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-neutral-300 dark:before:bg-neutral-600">
											{work}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="md:text-right md:pt-1 order-first md:order-last">
							<div class="text-sm font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
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
			<div class="flex items-baseline gap-4 mb-10 md:mb-14">
				<h2 class="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-300 dark:text-neutral-700">
					Skills
				</h2>
				<div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
				{#each published(meta.skills.content) as skill, i}
					<div style="animation: fadeSlideUp 0.4s ease-out {i * 0.08}s both">
						<h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-3">
							{skill.title}
						</h3>
						{#if skill.description}
							<div class="flex flex-wrap gap-1.5">
								{#each skill.description.split(', ') as tag}
									<span class="inline-block px-3 py-1.5 text-sm font-light rounded-sm bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/40 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
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
			<div class="flex items-baseline gap-4 mb-10 md:mb-14">
				<h2 class="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-300 dark:text-neutral-700">
					Interests
				</h2>
				<div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
			</div>

			<div class="flex flex-wrap gap-3">
				{#each published(meta.interests.content) as interest, i}
					<span
						class="inline-block px-4 py-2 text-sm font-light rounded-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all duration-300"
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
