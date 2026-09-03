/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */


export const samplePosts :any[] = [
    {
        id: 'post-1',
        user: {
            name: 'Amina Codes',
            avatar: 'https://i.pravatar.cc/150?img=32',
        },
        images: [
            'https://picsum.photos/id/1015/800/800',
            'https://picsum.photos/id/1016/800/800',
        ],
        description: 'Morning hike, the view was worth the climb 🏔️',
        likeCount: 128,
        comments: [
            { 
                id: 'c1', 
                author: 'Yousuf Dev', 
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta velit impedit, ipsa quasi aperiam quia cupiditate nisi officiis, iure voluptates minus, nemo asperiores ipsum. Illo, vel inventore? Ratione, atque minima?',
                image : 'https://i.pravatar.cc/50?img=12' 
            },
            { 
                id: 'c2', 
                author: 'Sara Keshua', 
                text: 'Where is this?' , 
                image :'https://i.pravatar.cc/50?img=65' 
            },
        ],
    },
    {
        id: 'post-2',
        user: {
            name: 'Omar Builds',
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
        images: ['https://picsum.photos/id/1025/800/800'],
        description: 'New setup, finally organized my desk.',
        likeCount: 42,
        comments: [],
    },
    {
        id: 'post-3',
        user: {
            name: 'Layla Art',
            avatar: 'https://i.pravatar.cc/150?img=45',
        },
        images: [
            'https://picsum.photos/id/1035/800/800',
            'https://picsum.photos/id/1039/800/800',
            'https://picsum.photos/id/1043/800/800',
        ],
        description: 'Sketch dump from this week 🎨',
        likeCount: 301,
        comments: [{ id: 'c3', author: 'amina.codes', text: 'These are gorgeous', image : 'https://i.pravatar.cc/150?img=31' }],
    },
]